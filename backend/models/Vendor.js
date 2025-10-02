import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxLength: [100, 'Business name cannot exceed 100 characters']
  },
  contactPerson: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  businessDetails: {
    registrationNumber: String,
    gstNumber: String,
    businessType: {
      type: String,
      enum: ['Manufacturer', 'Exporter', 'Trader', 'Supplier', 'Farmer', 'Cooperative']
    },
    yearEstablished: Number,
    annualTurnover: String
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    }
  },
  specializations: [{
    type: String,
    enum: [
      'Fresh Fruits',
      'Fresh Vegetables', 
      'Grains & Cereals',
      'Spices & Herbs',
      'Pulses & Legumes',
      'Oil Seeds',
      'Dairy Products',
      'Nuts & Dry Fruits',
      'Other'
    ]
  }],
  certifications: [String],
  exportCapacity: {
    type: String,
    enum: ['Small (< 100 MT/year)', 'Medium (100-1000 MT/year)', 'Large (> 1000 MT/year)']
  },
  paymentTerms: [String],
  deliveryTerms: [String],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
vendorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active timestamp
vendorSchema.methods.updateLastActive = function() {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

// Virtual for full name
vendorSchema.virtual('contactPerson.fullName').get(function() {
  return `${this.contactPerson.firstName} ${this.contactPerson.lastName}`;
});

// Index for searching
vendorSchema.index({ businessName: 'text', 'contactPerson.firstName': 'text', 'contactPerson.lastName': 'text' });
vendorSchema.index({ email: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ specializations: 1 });

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;