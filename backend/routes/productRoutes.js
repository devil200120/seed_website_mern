import express from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getProductCategories
} from '../controllers/productController.js';
import { validateProduct } from '../middleware/validation.js';
import { vendorAuth } from '../middleware/vendorAuth.js';
import { upload } from '../utils/cloudinaryConfig.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);

// Protected vendor routes
router.get('/vendor/my-products', vendorAuth, getVendorProducts);
router.post('/', vendorAuth, upload.single('image'), validateProduct, createProduct);
router.put('/:id', vendorAuth, upload.single('image'), validateProduct, updateProduct);
router.delete('/:id', vendorAuth, deleteProduct);

export default router;