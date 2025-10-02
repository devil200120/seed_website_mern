import Admin from '../models/Admin.js';
import LicenseKey from '../models/LicenseKey.js';
import { generateToken } from '../middleware/auth.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

/**
 * Check if admin signup is allowed
 */
export const checkSignupStatus = async (req, res) => {
  try {
    const adminExists = await Admin.adminExists();
    
    res.status(200).json({
      success: true,
      data: {
        signupAllowed: !adminExists,
        message: adminExists 
          ? 'Admin account already exists. Signup is disabled.' 
          : 'Admin signup is allowed.'
      }
    });
  } catch (error) {
    console.error('Check signup status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check signup status'
    });
  }
};

/**
 * Admin signup
 */
export const adminSignup = async (req, res) => {
  try {
    const { email, password, name, licenseKey } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.adminExists();
    if (adminExists) {
      return res.status(403).json({
        success: false,
        message: 'Admin account already exists. Only one admin is allowed.'
      });
    }

    // Check if email is already used
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'An admin with this email already exists.'
      });
    }

    // Validate license key
    const validLicense = await LicenseKey.findValidKey(licenseKey);
    if (!validLicense) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired license key.'
      });
    }

    // Check if license key email matches signup email
    if (validLicense.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'License key was issued for a different email address.'
      });
    }

    // Create admin account
    const admin = new Admin({
      email,
      password,
      name,
      licenseKey,
      role: 'super_admin' // First admin is super admin
    });

    await admin.save();

    // Mark license key as used
    await validLicense.markAsUsed(admin._id);

    // Generate JWT token
    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(err => {
      console.error('Welcome email failed:', err);
    });

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          createdAt: admin.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Admin with this email or license key already exists.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create admin account'
    });
  }
};

/**
 * Admin login
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await admin.resetLoginAttempts();
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

/**
 * Get admin profile
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;
    
    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin profile'
    });
  }
};

/**
 * Update admin profile
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const admin = req.admin;

    if (name) {
      admin.name = name;
    }

    admin.updatedAt = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          updatedAt: admin.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

/**
 * Change admin password
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Update password
    admin.password = newPassword;
    admin.updatedAt = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

/**
 * Admin logout (client-side token removal)
 */
export const adminLogout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to:
    // - Blacklist the token
    // - Log the logout event
    // - Clear any session data
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};