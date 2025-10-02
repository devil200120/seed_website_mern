import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';

// Protect vendor routes
const vendorAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get vendor from token
      const vendor = await Vendor.findById(decoded.id).select('-password');
      
      if (!vendor) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Vendor not found.'
        });
      }

      // Check if vendor is approved
      if (vendor.status !== 'approved') {
        return res.status(403).json({
          success: false,
          message: `Access denied. Account is ${vendor.status}.`
        });
      }

      req.vendor = vendor;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
  } catch (error) {
    console.error('Vendor auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if vendor is verified
const requireVerified = (req, res, next) => {
  if (!req.vendor.verified) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Vendor verification required.'
    });
  }
  next();
};

export { vendorAuth, requireVerified };