import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: false // Will be auto-generated
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    company: {
      type: String,
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters']
    }
  },
  products: [{
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: true
    },
    estimatedPrice: {
      type: Number,
      default: 0
    },
    lineTotal: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  totalItems: {
    type: Number,
    required: true,
    default: function() {
      return this.products.length;
    }
  },
  totalEstimatedValue: {
    type: Number,
    default: 0
  },
  estimatedTotal: {
    type: Number,
    default: 0
  },
  estimatedTax: {
    type: Number,
    default: 0
  },
  priceCalculation: {
    subtotal: {
      type: Number,
      default: 0
    },
    taxRate: {
      type: Number,
      default: 0.18
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: [
      'pending',        // Just submitted
      'reviewed',       // Admin has seen it
      'quoted',         // Price quote sent
      'confirmed',      // Customer confirmed
      'processing',     // Being processed
      'shipped',        // Shipped
      'delivered',      // Delivered
      'cancelled'       // Cancelled
    ],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  requirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Requirements cannot exceed 1000 characters']
  },
  adminNotes: {
    type: String,
    trim: true
  },
  quotedPrice: {
    type: Number,
    default: 0
  },
  quotedAt: {
    type: Date
  },
  quotedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  confirmedAt: {
    type: Date
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  expectedDelivery: {
    type: Date
  },
  metadata: {
    sourceIp: String,
    userAgent: String,
    referrer: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.orderNumber) {
      const count = await this.constructor.countDocuments();
      const orderNum = String(count + 1).padStart(6, '0');
      this.orderNumber = `ORD-${orderNum}`;
      
      // Calculate total estimated value
      this.totalEstimatedValue = this.products.reduce((sum, product) => {
        return sum + (product.estimatedPrice || 0);
      }, 0);
    }
    
    this.updatedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Update total items count
orderSchema.pre('save', function(next) {
  this.totalItems = this.products.length;
  next();
});

// Index for efficient queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ priority: 1 });

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$totalEstimatedValue' }
      }
    }
  ]);

  const totalOrders = await this.countDocuments();
  const pendingOrders = await this.countDocuments({ status: 'pending' });
  const processingOrders = await this.countDocuments({ status: { $in: ['confirmed', 'processing'] } });
  const completedOrders = await this.countDocuments({ status: 'delivered' });

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    statusBreakdown: stats
  };
};

// Static method to get recent orders
orderSchema.statics.getRecentOrders = async function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('quotedBy', 'name email');
};

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, adminId = null) {
  this.status = newStatus;
  this.updatedAt = new Date();
  
  if (newStatus === 'quoted' && adminId) {
    this.quotedAt = new Date();
    this.quotedBy = adminId;
  }
  
  if (newStatus === 'confirmed') {
    this.confirmedAt = new Date();
  }
  
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order;