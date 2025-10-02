import Order from '../models/Order.js';
import { 
  sendOrderNotificationToAdmin, 
  sendOrderConfirmationToCustomer, 
  sendOrderConfirmationNotificationToAdmin,
  sendOrderStatusUpdateToCustomer,
  sendQuoteNotificationToCustomer,
  sendOrderConfirmationWithInvoice,
  sendQuoteWithInvoicePDF
} from '../utils/emailService.js';

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const { customerInfo, products, requirements, priceCalculation, deliveryAddress } = req.body;

    console.log('📦 Creating order with data:', {
      customerInfo,
      products: products?.length,
      requirements,
      priceCalculation,
      deliveryAddress
    });

    // Validate required fields
    if (!customerInfo || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer information and products are required'
      });
    }

    // Create new order
    const order = new Order({
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        company: customerInfo.company || ''
      },
      deliveryAddress: deliveryAddress ? {
        street: deliveryAddress.street || '',
        city: deliveryAddress.city || '',
        state: deliveryAddress.state || '',
        country: deliveryAddress.country || '',
        zipCode: deliveryAddress.zipCode || ''
      } : null,
      products: products.map(product => ({
        productId: product.productId,
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        estimatedPrice: product.estimatedPrice || 0,
        lineTotal: product.lineTotal || 0
      })),
      requirements: requirements || '',
      // Set initial estimated values based on current prices
      totalEstimatedValue: priceCalculation?.subtotal || 0,
      estimatedTotal: priceCalculation?.total || 0,
      estimatedTax: priceCalculation?.taxAmount || 0,
      priceCalculation: priceCalculation || null,
      metadata: {
        sourceIp: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer
      }
    });

    console.log('💾 Saving order to database...');
    await order.save();
    console.log('✅ Order saved successfully:', order.orderNumber);

    // Send notification emails (non-blocking)
    Promise.all([
      sendOrderNotificationToAdmin(order),
      sendOrderConfirmationWithInvoice(order) // Send with invoice PDF attachment
    ]).catch(error => {
      console.error('Email notification error:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          orderNumber: order.orderNumber,
          customerInfo: order.customerInfo,
          deliveryAddress: order.deliveryAddress,
          products: order.products,
          totalItems: order.totalItems,
          totalEstimatedValue: order.totalEstimatedValue,
          estimatedTotal: order.estimatedTotal,
          estimatedTax: order.estimatedTax,
          priceCalculation: order.priceCalculation,
          status: order.status,
          createdAt: order.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } },
        { 'customerInfo.company': { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const orders = await Order.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNum)
      .populate('quotedBy', 'name email');

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limitNum);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalOrders,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders'
    });
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('quotedBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order'
    });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, quotedPrice, adminNotes } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousStatus = order.status;

    // Update order
    if (status) {
      await order.updateStatus(status, req.admin._id);
    }

    if (quotedPrice !== undefined) {
      order.quotedPrice = quotedPrice;
      order.totalEstimatedValue = quotedPrice;
    }

    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    await order.save();

    // Send email notifications for status changes
    if (status && status !== previousStatus) {
      console.log(`📧 Sending status update notification: ${previousStatus} → ${status} for order ${order.orderNumber}`);
      
      // Send customer status update notification (non-blocking)
      sendOrderStatusUpdateToCustomer(order, status, previousStatus).catch(error => {
        console.error('Failed to send customer status update:', error);
      });

      // Send admin notification if order was confirmed
      if (status === 'confirmed') {
        console.log('📧 Sending admin notification for order confirmation:', order.orderNumber);
        
        sendOrderConfirmationNotificationToAdmin(order).catch(error => {
          console.error('Failed to send admin confirmation notification:', error);
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
};

/**
 * Get order statistics
 */
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getOrderStats();
    const recentOrders = await Order.getRecentOrders(5);

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentOrders
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order statistics'
    });
  }
};

/**
 * Delete order (admin only)
 */
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete orders that are being processed'
      });
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
};

/**
 * Customer confirm order (public endpoint)
 */
export const confirmOrder = async (req, res) => {
  try {
    const { orderNumber, customerEmail } = req.body;

    // Find order by order number and customer email for security
    const order = await Order.findOne({
      orderNumber,
      'customerInfo.email': customerEmail
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or email does not match'
      });
    }

    // Check if order can be confirmed
    if (!['quoted', 'reviewed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be confirmed. Current status: ${order.status}`
      });
    }

    const previousStatus = order.status;

    // Update order status to confirmed
    await order.updateStatus('confirmed');
    
    console.log('✅ Customer confirmed order:', order.orderNumber);

    // Send customer notification for status change
    sendOrderStatusUpdateToCustomer(order, 'confirmed', previousStatus).catch(error => {
      console.error('Failed to send customer status update:', error);
    });

    // Send admin notification email (non-blocking)
    sendOrderConfirmationNotificationToAdmin(order).catch(error => {
      console.error('Failed to send admin confirmation notification:', error);
    });

    res.status(200).json({
      success: true,
      message: 'Order confirmed successfully',
      data: {
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          confirmedAt: order.confirmedAt,
          quotedPrice: order.quotedPrice
        }
      }
    });

  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm order'
    });
  }
};

/**
 * Provide quote for an order (admin only)
 */
export const provideQuote = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { quotedPrice, adminNotes, deliveryTime } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousStatus = order.status;

    // Update order with quote information
    order.quotedPrice = quotedPrice;
    order.totalEstimatedValue = quotedPrice;
    
    if (adminNotes) {
      order.adminNotes = adminNotes;
    }
    
    if (deliveryTime) {
      order.expectedDelivery = new Date(deliveryTime);
    }

    // Update status to quoted
    await order.updateStatus('quoted', req.admin._id);
    await order.save();

    console.log(`💰 Quote provided for order ${order.orderNumber}: $${quotedPrice}`);

    // Send specialized quote notification with invoice PDF to customer
    sendQuoteWithInvoicePDF(order).catch(error => {
      console.error('Failed to send quote with invoice PDF to customer:', error);
    });

    // Also send general status update for admin tracking
    sendOrderStatusUpdateToCustomer(order, 'quoted', previousStatus).catch(error => {
      console.error('Failed to send status update to customer:', error);
    });

    res.status(200).json({
      success: true,
      message: 'Quote provided successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Provide quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to provide quote'
    });
  }
};

// @desc    Generate invoice for order
// @route   GET /api/orders/:orderId/invoice
// @access  Private (Admin) or Public (with order number and email)
export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderNumber, customerEmail } = req.query;

    let order;

    // If orderId is provided (admin access)
    if (orderId !== 'by-number') {
      order = await Order.findById(orderId);
    } else {
      // If orderNumber and email are provided (customer access)
      if (!orderNumber || !customerEmail) {
        return res.status(400).json({
          success: false,
          message: 'Order number and customer email are required'
        });
      }

      order = await Order.findOne({
        orderNumber: orderNumber,
        'customerInfo.email': customerEmail.toLowerCase()
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate invoice data
    const invoiceData = {
      order: order,
      invoiceNumber: `INV-${order.orderNumber?.replace('ORD-', '') || '000001'}`,
      invoiceDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      subtotal: order.products?.reduce((sum, product) => {
        return sum + ((product.estimatedPrice || 0) * product.quantity);
      }, 0) || order.quotedPrice || 0,
      taxRate: 0.18, // 18% tax
      companyInfo: {
        name: 'Field to Feed Export',
        tagline: 'Premium Agricultural Products',
        address: 'Agriculture Business Hub, Farm District',
        phone: '+1 (555) 123-4567',
        email: 'orders@fieldtofeed.com',
        website: 'www.fieldtofeed.com'
      }
    };

    // Calculate tax and total
    invoiceData.taxAmount = invoiceData.subtotal * invoiceData.taxRate;
    invoiceData.total = invoiceData.subtotal + invoiceData.taxAmount;

    res.status(200).json({
      success: true,
      message: 'Invoice generated successfully',
      data: invoiceData
    });

  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice'
    });
  }
};