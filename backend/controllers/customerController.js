import Customer from '../models/Customer.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Register new customer
// @route   POST /api/customers/register
// @access  Public
const registerCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      fullName,
      email,
      password,
      phone,
      company,
      country,
      address,
      city,
      state,
      zipCode
    } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Create customer with address object
    const customer = await Customer.create({
      fullName,
      email,
      password,
      phone,
      company,
      address: {
        street: address || '',
        city: city || '',
        state: state || '',
        country,
        zipCode: zipCode || ''
      }
    });

    // Generate verification token
    const verificationToken = customer.generateVerificationToken();
    await customer.save();

    // TODO: Send verification email
    // await sendVerificationEmail(customer.email, verificationToken);

    // Generate JWT token
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully. Please check your email to verify your account.',
      data: {
        customer: {
          id: customer._id,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          country: customer.address.country,
          status: customer.status,
          verified: customer.verified
        },
        token
      }
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
const loginCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if customer exists
    const customer = await Customer.findOne({ email }).select('+password');
    if (!customer || !(await customer.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if customer is active
    if (customer.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${customer.status}. Please contact support.`
      });
    }

    // Update last active
    customer.updateLastActive();

    // Generate token
    const token = generateToken(customer._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          status: customer.status,
          verified: customer.verified
        },
        token
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Verify customer email
// @route   GET /api/customers/verify/:token
// @access  Public
const verifyCustomerEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find customer with valid verification token
    const customer = await Customer.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Mark customer as verified
    customer.verified = true;
    customer.verificationToken = undefined;
    customer.verificationTokenExpiry = undefined;
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private (Customer)
const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { customer }
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private (Customer)
const updateCustomerProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      fullName,
      phone,
      company,
      address,
      city,
      state,
      country,
      zipCode
    } = req.body;

    // Build update object
    const updateData = {
      fullName,
      phone,
      company
    };

    // Update address if provided
    if (address || city || state || country || zipCode) {
      updateData.address = {
        street: address,
        city,
        state,
        country,
        zipCode
      };
    }

    const customer = await Customer.findByIdAndUpdate(
      req.customer.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { customer }
    });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Request password reset
// @route   POST /api/customers/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'No customer found with this email'
      });
    }

    // Generate reset token
    const resetToken = customer.generatePasswordResetToken();
    await customer.save();

    // TODO: Send password reset email
    // await sendPasswordResetEmail(customer.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/customers/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find customer with valid reset token
    const customer = await Customer.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    }).select('+password');

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    customer.password = password;
    customer.resetPasswordToken = undefined;
    customer.resetPasswordExpiry = undefined;
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get all customers (Admin only)
// @route   GET /api/customers
// @access  Private (Admin)
const getAllCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      verified,
      search,
      sortBy = 'registeredAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const customers = await Customer.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await Customer.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update customer status (Admin only)
// @route   PUT /api/customers/:id/status
// @access  Private (Admin)
const updateCustomerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Customer status updated to ${status}`,
      data: { customer }
    });
  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete customer (Admin only)
// @route   DELETE /api/customers/:id
// @access  Private (Admin)
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  registerCustomer,
  loginCustomer,
  verifyCustomerEmail,
  getCustomerProfile,
  updateCustomerProfile,
  forgotPassword,
  resetPassword,
  getAllCustomers,
  updateCustomerStatus,
  deleteCustomer
};
