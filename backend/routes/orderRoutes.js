import express from 'express';
import Order from '../models/Order.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  deleteOrder,
  confirmOrder,
  provideQuote,
  generateInvoice
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Validation for order creation
const validateOrderCreation = [
  body('customerInfo.name')
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('customerInfo.phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  
  body('customerInfo.company')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Company name cannot exceed 200 characters'),
  
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  
  body('products.*.productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  
  body('products.*.name')
    .notEmpty()
    .withMessage('Product name is required'),
  
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Product quantity must be at least 1'),
  
  body('requirements')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Requirements cannot exceed 1000 characters'),
  
  handleValidationErrors
];

// Validation for order status update
const validateOrderUpdate = [
  body('status')
    .optional()
    .isIn(['pending', 'reviewed', 'quoted', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status value'),
  
  body('quotedPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Quoted price must be a positive number'),
  
  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

// Validation for customer order confirmation
const validateOrderConfirmation = [
  body('orderNumber')
    .notEmpty()
    .withMessage('Order number is required')
    .matches(/^ORD-\d{6}$/)
    .withMessage('Invalid order number format'),
  
  body('customerEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

// Validation for providing quote
const validateQuote = [
  body('quotedPrice')
    .isFloat({ min: 0 })
    .withMessage('Quoted price must be a positive number'),
  
  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters'),
  
  body('deliveryTime')
    .optional()
    .isISO8601()
    .withMessage('Delivery time must be a valid date'),
  
  handleValidationErrors
];

// Public routes
router.post('/create', validateOrderCreation, createOrder);
router.post('/confirm', validateOrderConfirmation, confirmOrder);
router.get('/:orderId/invoice', generateInvoice); // Public invoice access with order number and email

// Test route for PDF generation (development only)
if (process.env.NODE_ENV === 'development') {
  router.get('/test-pdf/:orderId', async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      
      const { generateInvoicePDF } = await import('../utils/pdfGenerator.js');
      const pdfResult = await generateInvoicePDF(order);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.filename}"`);
      res.send(pdfResult.buffer);
    } catch (error) {
      console.error('PDF test error:', error);
      res.status(500).json({ success: false, message: 'PDF generation failed' });
    }
  });
}

// Protected routes (require admin authentication)
router.use(authenticate); // All routes below require authentication

router.get('/all', getAllOrders);
router.get('/stats', getOrderStats);
router.get('/:orderId', getOrderById);
router.get('/:orderId/admin-invoice', generateInvoice); // Admin invoice access
router.put('/:orderId', validateOrderUpdate, updateOrderStatus);
router.post('/:orderId/quote', validateQuote, provideQuote);
router.delete('/:orderId', deleteOrder);

export default router;