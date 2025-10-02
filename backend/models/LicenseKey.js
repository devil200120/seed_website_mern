import mongoose from 'mongoose';

const licenseKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'License key is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'used', 'expired'],
    default: 'pending'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date,
    default: null
  },
  usedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      // Default expiry: 24 hours from now
      const hours = parseInt(process.env.LICENSE_EXPIRY_HOURS) || 24;
      return new Date(Date.now() + (hours * 60 * 60 * 1000));
    }
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  attempts: {
    type: Number,
    default: 0
  },
  metadata: {
    ip: String,
    userAgent: String,
    requestedAt: Date
  }
}, {
  timestamps: true
});

// Virtual to check if license key is expired
licenseKeySchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Virtual to check if license key is valid
licenseKeySchema.virtual('isValid').get(function() {
  return this.status === 'sent' && !this.isExpired;
});

// Method to mark license key as used
licenseKeySchema.methods.markAsUsed = function(adminId) {
  this.status = 'used';
  this.usedAt = new Date();
  this.usedBy = adminId;
  return this.save();
};

// Method to mark license key as sent
licenseKeySchema.methods.markAsSent = function() {
  this.status = 'sent';
  this.sentAt = new Date();
  return this.save();
};

// Static method to find valid license key
licenseKeySchema.statics.findValidKey = function(key) {
  return this.findOne({
    key: key,
    status: 'sent',
    expiresAt: { $gt: new Date() }
  });
};

// Static method to cleanup expired keys
licenseKeySchema.statics.cleanupExpired = function() {
  return this.updateMany(
    {
      expiresAt: { $lt: new Date() },
      status: { $in: ['pending', 'sent'] }
    },
    {
      $set: { status: 'expired' }
    }
  );
};

// Index for efficient queries
licenseKeySchema.index({ key: 1 });
licenseKeySchema.index({ email: 1 });
licenseKeySchema.index({ status: 1 });

// TTL index to automatically delete expired documents after 30 days
// This also serves as an index for expiresAt queries
licenseKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const LicenseKey = mongoose.model('LicenseKey', licenseKeySchema);

export default LicenseKey;