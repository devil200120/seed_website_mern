import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { validationResult } from 'express-validator';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      vendor,
      search,
      featured,
      availability = true,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice
    } = req.query;

    // Build filter object
    const filter = { availability: availability === 'true' };
    
    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    if (featured !== undefined) filter.featured = featured === 'true';
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.$and = filter.$and || [];
      if (minPrice) {
        filter.$and.push({ 'priceRange.min': { $gte: parseFloat(minPrice) } });
      }
      if (maxPrice) {
        filter.$and.push({ 'priceRange.max': { $lte: parseFloat(maxPrice) } });
      }
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const products = await Product.find(filter)
      .populate('vendor', 'businessName contactPerson.firstName contactPerson.lastName rating verified status')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // For now, show all products (you can uncomment the filtering later)
    // const approvedProducts = products.filter(product => product.vendor !== null);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        products: products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          pages: Math.ceil(products.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const products = await Product.find({ 
      featured: true, 
      availability: true 
    })
    .populate('vendor', 'businessName contactPerson.firstName contactPerson.lastName rating verified')
    .sort({ createdAt: -1 })
    .limit(limit);

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'businessName contactPerson.firstName contactPerson.lastName phone email address rating verified totalOrders');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor)
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      vendor: req.vendor.id
    };

    // Handle image upload
    if (req.file) {
      productData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    // Parse JSON fields if they're strings
    if (typeof productData.quickOptions === 'string') {
      try {
        productData.quickOptions = JSON.parse(productData.quickOptions);
      } catch (e) {
        console.error('Error parsing quickOptions:', e);
      }
    }
    if (typeof productData.priceRange === 'string') {
      try {
        productData.priceRange = JSON.parse(productData.priceRange);
      } catch (e) {
        console.error('Error parsing priceRange:', e);
      }
    }
    if (typeof productData.specifications === 'string') {
      try {
        productData.specifications = JSON.parse(productData.specifications);
      } catch (e) {
        console.error('Error parsing specifications:', e);
      }
    }

    // Convert string values to appropriate types
    if (productData.minOrderQuantity) {
      productData.minOrderQuantity = parseInt(productData.minOrderQuantity);
    }
    if (productData.currentPrice) {
      productData.currentPrice = parseFloat(productData.currentPrice);
    }
    if (productData.featured === 'true' || productData.featured === true) {
      productData.featured = true;
    } else {
      productData.featured = false;
    }
    if (productData.availability === 'false') {
      productData.availability = false;
    } else {
      productData.availability = true;
    }

    const product = await Product.create(productData);
    
    // Populate vendor info
    await product.populate('vendor', 'businessName contactPerson.firstName contactPerson.lastName rating verified');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    // If there was an error and a file was uploaded, delete it from Cloudinary
    if (req.file) {
      try {
        await deleteFromCloudinary(req.file.filename);
      } catch (deleteError) {
        console.error('Error deleting uploaded file:', deleteError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor - own products only)
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    let updateData = { ...req.body };

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (product.image.publicId) {
        try {
          await deleteFromCloudinary(product.image.publicId);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }
      }

      updateData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    // Parse JSON fields if they're strings
    if (typeof updateData.quickOptions === 'string') {
      updateData.quickOptions = JSON.parse(updateData.quickOptions);
    }
    if (typeof updateData.priceRange === 'string') {
      updateData.priceRange = JSON.parse(updateData.priceRange);
    }
    if (typeof updateData.specifications === 'string') {
      updateData.specifications = JSON.parse(updateData.specifications);
    }

    // Convert currentPrice to number if provided
    if (updateData.currentPrice !== undefined) {
      updateData.currentPrice = parseFloat(updateData.currentPrice);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('vendor', 'businessName contactPerson.firstName contactPerson.lastName rating verified');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor - own products only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete image from Cloudinary
    if (product.image.publicId) {
      try {
        await deleteFromCloudinary(product.image.publicId);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get vendor's products
// @route   GET /api/products/vendor/my-products
// @access  Private (Vendor)
const getVendorProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      availability,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { vendor: req.vendor.id };
    
    if (category) filter.category = category;
    if (availability !== undefined) filter.availability = availability === 'true';
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get vendor products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get product categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getProductCategories
};