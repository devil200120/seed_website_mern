import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';

/**
 * Customer authentication middleware
 */
export const customerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const customer = await Customer.findById(decoded.id).select('-password');
    
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Customer not found.'
      });
    }

    if (customer.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${customer.status}. Please contact support.`
      });
    }

    req.customer = customer;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    console.error('Customer auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};
