import crypto from 'crypto';

/**
 * Generate a secure license key
 * Format: SEED-XXXX-XXXX-XXXX-XXXX
 */
export const generateLicenseKey = () => {
  const segments = [];
  
  // Generate 4 segments of 4 characters each
  for (let i = 0; i < 4; i++) {
    const segment = crypto.randomBytes(2).toString('hex').toUpperCase();
    segments.push(segment);
  }
  
  return `SEED-${segments.join('-')}`;
};

/**
 * Validate license key format
 */
export const validateLicenseKeyFormat = (key) => {
  const licenseKeyRegex = /^SEED-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
  return licenseKeyRegex.test(key);
};

/**
 * Generate secure random token
 */
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a string using SHA256
 */
export const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

/**
 * Generate a time-based OTP
 */
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  
  return otp;
};

/**
 * Create expiration date
 */
export const createExpirationDate = (hours = 24) => {
  return new Date(Date.now() + (hours * 60 * 60 * 1000));
};

/**
 * Check if date is expired
 */
export const isExpired = (date) => {
  return new Date() > new Date(date);
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(crypto.randomInt(0, chars.length));
  }
  
  return result;
};