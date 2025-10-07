import express from 'express';
import {
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
} from '../controllers/customerController.js';
import { 
  validateCustomerRegistration, 
  validateCustomerLogin,
  validateCustomerUpdate,
  validateForgotPassword,
  validateResetPassword
} from '../middleware/validation.js';
import { customerAuth } from '../middleware/customerAuth.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateCustomerRegistration, registerCustomer);
router.post('/login', validateCustomerLogin, loginCustomer);
router.get('/verify/:token', verifyCustomerEmail);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Protected customer routes
router.get('/profile', customerAuth, getCustomerProfile);
router.put('/profile', customerAuth, validateCustomerUpdate, updateCustomerProfile);

// Admin only routes
router.get('/', authenticate, getAllCustomers);
router.put('/:id/status', authenticate, updateCustomerStatus);
router.delete('/:id', authenticate, deleteCustomer);

export default router;
