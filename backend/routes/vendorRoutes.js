import express from 'express';
import {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  updateVendorStatus
} from '../controllers/vendorController.js';
import { 
  validateVendorRegistration, 
  validateVendorLogin 
} from '../middleware/validation.js';
import { vendorAuth } from '../middleware/vendorAuth.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateVendorRegistration, registerVendor);
router.post('/login', validateVendorLogin, loginVendor);

// Protected vendor routes
router.get('/profile', vendorAuth, getVendorProfile);
router.put('/profile', vendorAuth, updateVendorProfile);

// Admin only routes (assuming admin role exists)
router.get('/', authenticate, getAllVendors);
router.put('/:id/status', authenticate, updateVendorStatus);

export default router;