import dotenv from 'dotenv';
import { sendLicenseKeyEmail } from './utils/emailService.js';

dotenv.config();

// Test email functionality
async function testEmail() {
  try {
    console.log('🧪 Testing email functionality...');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔐 Email Pass:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'Not set');
    
    const testLicenseKey = 'SEED-TEST-1234-5678-ABCD';
    const testEmail = 'subhankardash45585@gmail.com'; // Using your email
    
    const result = await sendLicenseKeyEmail(testEmail, testLicenseKey);
    console.log('✅ Email test successful:', result);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();