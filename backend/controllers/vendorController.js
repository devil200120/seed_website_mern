import Vendor from '../models/Vendor.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Register new vendor
// @route   POST /api/vendors/register
// @access  Public
const registerVendor = async (req, res) => {
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
      businessName,
      contactPerson,
      email,
      password,
      phone,
      businessDetails,
      address,
      specializations,
      certifications,
      exportCapacity,
      paymentTerms,
      deliveryTerms
    } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this email already exists'
      });
    }

    // Create vendor
    const vendor = await Vendor.create({
      businessName,
      contactPerson,
      email,
      password,
      phone,
      businessDetails,
      address,
      specializations,
      certifications,
      exportCapacity,
      paymentTerms,
      deliveryTerms
    });

    // Generate token
    const token = generateToken(vendor._id);

    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully. Awaiting approval.',
      data: {
        vendor: {
          id: vendor._id,
          businessName: vendor.businessName,
          email: vendor.email,
          status: vendor.status,
          verified: vendor.verified
        },
        token
      }
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Login vendor
// @route   POST /api/vendors/login
// @access  Public
const loginVendor = async (req, res) => {
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

    // Check if vendor exists
    const vendor = await Vendor.findOne({ email }).select('+password');
    if (!vendor || !(await vendor.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if vendor is approved
    if (vendor.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: `Account is ${vendor.status}. Please contact support.`
      });
    }

    // Update last active
    vendor.updateLastActive();

    // Generate token
    const token = generateToken(vendor._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        vendor: {
          id: vendor._id,
          businessName: vendor.businessName,
          email: vendor.email,
          status: vendor.status,
          verified: vendor.verified
        },
        token
      }
    });
  } catch (error) {
    console.error('Vendor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor)
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { vendor }
    });
  } catch (error) {
    console.error('Get vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private (Vendor)
const updateVendorProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { vendor }
    });
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get all vendors (Admin only)
// @route   GET /api/vendors
// @access  Private (Admin)
const getAllVendors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      specialization,
      search,
      sortBy = 'joinedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (specialization) filter.specializations = { $in: [specialization] };
    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { 'contactPerson.firstName': { $regex: search, $options: 'i' } },
        { 'contactPerson.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const vendors = await Vendor.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await Vendor.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        vendors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update vendor status (Admin only)
// @route   PUT /api/vendors/:id/status
// @access  Private (Admin)
const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Vendor status updated to ${status}`,
      data: { vendor }
    });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  updateVendorStatus
};