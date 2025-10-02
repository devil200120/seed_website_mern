import express from 'express';
import {
  checkSignupStatus,
  adminSignup,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  adminLogout
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateAdminSignup,
  validateAdminLogin,
  validateChangePassword
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/signup-status', checkSignupStatus);
router.post('/signup', validateAdminSignup, adminSignup);
router.post('/login', validateAdminLogin, adminLogin);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.post('/change-password', validateChangePassword, changeAdminPassword);
router.post('/logout', adminLogout);

export default router;