import LicenseKey from '../models/LicenseKey.js';
import Admin from '../models/Admin.js';
import { generateLicenseKey } from '../utils/cryptoUtils.js';
import { sendLicenseKeyEmail } from '../utils/emailService.js';

/**
 * Request license key
 */
export const requestLicenseKey = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.adminExists();
    if (adminExists) {
      return res.status(403).json({
        success: false,
        message: 'Admin account already exists. License key request is not allowed.'
      });
    }

    // Check for existing pending or sent license keys for this email
    const existingLicense = await LicenseKey.findOne({
      email,
      status: { $in: ['pending', 'sent'] },
      expiresAt: { $gt: new Date() }
    });

    if (existingLicense) {
      // If license was already sent, inform user
      if (existingLicense.status === 'sent') {
        return res.status(409).json({
          success: false,
          message: 'A license key has already been sent to this email address. Please check your inbox.'
        });
      }

      // If license is pending, send it now
      try {
        await sendLicenseKeyEmail(email, existingLicense.key);
        await existingLicense.markAsSent();

        return res.status(200).json({
          success: true,
          message: 'License key sent successfully to your email address.',
          data: {
            email,
            expiresAt: existingLicense.expiresAt
          }
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return res.status(500).json({
          success: false,
          message: 'License key generated but failed to send email. Please try again.'
        });
      }
    }

    // Clean up any expired license keys
    await LicenseKey.cleanupExpired();

    // Generate new license key
    const licenseKey = generateLicenseKey();

    // Create license key record
    const newLicense = new LicenseKey({
      key: licenseKey,
      email,
      metadata: {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        requestedAt: new Date()
      }
    });

    await newLicense.save();

    // Send license key via email
    try {
      await sendLicenseKeyEmail(email, licenseKey);
      await newLicense.markAsSent();

      res.status(200).json({
        success: true,
        message: 'License key sent successfully to your email address.',
        data: {
          email,
          expiresAt: newLicense.expiresAt
        }
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Mark license as failed but keep it for retry
      newLicense.status = 'pending';
      await newLicense.save();

      res.status(500).json({
        success: false,
        message: 'License key generated but failed to send email. Please try again in a few minutes.',
        data: {
          canRetry: true
        }
      });
    }

  } catch (error) {
    console.error('Request license key error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A license key request is already in progress for this email.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process license key request'
    });
  }
};

/**
 * Validate license key
 */
export const validateLicenseKey = async (req, res) => {
  try {
    const { licenseKey, email } = req.body;

    if (!licenseKey || !email) {
      return res.status(400).json({
        success: false,
        message: 'License key and email are required'
      });
    }

    // Find the license key
    const license = await LicenseKey.findOne({ key: licenseKey });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: 'License key not found'
      });
    }

    // Check if license key matches the email
    if (license.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'License key does not match the provided email address'
      });
    }

    // Check if license key is already used
    if (license.status === 'used') {
      return res.status(400).json({
        success: false,
        message: 'License key has already been used'
      });
    }

    // Check if license key is expired
    if (license.isExpired) {
      // Mark as expired
      license.status = 'expired';
      await license.save();

      return res.status(400).json({
        success: false,
        message: 'License key has expired'
      });
    }

    // Check if license key was sent
    if (license.status !== 'sent') {
      return res.status(400).json({
        success: false,
        message: 'License key is not valid for use'
      });
    }

    // Increment attempts
    license.attempts += 1;
    await license.save();

    res.status(200).json({
      success: true,
      message: 'License key is valid',
      data: {
        valid: true,
        email: license.email,
        expiresAt: license.expiresAt
      }
    });

  } catch (error) {
    console.error('Validate license key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate license key'
    });
  }
};

/**
 * Get license key status
 */
export const getLicenseKeyStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find the latest license key for this email
    const license = await LicenseKey.findOne({ email })
      .sort({ createdAt: -1 });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: 'No license key found for this email',
        data: {
          canRequest: true
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: license.status,
        email: license.email,
        createdAt: license.createdAt,
        expiresAt: license.expiresAt,
        isExpired: license.isExpired,
        canRequest: license.status === 'used' || license.isExpired
      }
    });

  } catch (error) {
    console.error('Get license key status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get license key status'
    });
  }
};

/**
 * Resend license key (for failed email delivery)
 */
export const resendLicenseKey = async (req, res) => {
  try {
    const { email } = req.body;

    // Find pending license key
    const license = await LicenseKey.findOne({
      email,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: 'No pending license key found for this email'
      });
    }

    // Check if admin already exists
    const adminExists = await Admin.adminExists();
    if (adminExists) {
      return res.status(403).json({
        success: false,
        message: 'Admin account already exists. License key is no longer needed.'
      });
    }

    // Try to send email again
    try {
      await sendLicenseKeyEmail(email, license.key);
      await license.markAsSent();

      res.status(200).json({
        success: true,
        message: 'License key resent successfully',
        data: {
          email,
          expiresAt: license.expiresAt
        }
      });

    } catch (emailError) {
      console.error('Resend email failed:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to resend license key email'
      });
    }

  } catch (error) {
    console.error('Resend license key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend license key'
    });
  }
};