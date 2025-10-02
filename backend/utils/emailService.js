import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateInvoicePDF, savePDFToTemp, cleanupTempPDF } from './pdfGenerator.js';

dotenv.config();

/**
 * Create email transporter
 */
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // Use STARTTLS instead of SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Production-specific settings for Render
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    // Timeout settings for Render
    connectionTimeout: 60000,   // 60 seconds
    greetingTimeout: 30000,     // 30 seconds
    socketTimeout: 60000,       // 60 seconds
    // TLS settings
    tls: {
      ciphers: 'SSLv3'
    }
  };

  // Add debug logging for production troubleshooting
  if (process.env.NODE_ENV === 'production') {
    config.debug = false;
    config.logger = false;
  }

  return nodemailer.createTransporter(config);
};

/**
 * Send license key email
 */
export const sendLicenseKeyEmail = async (email, licenseKey) => {
  try {
    const transporter = createTransporter();

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin License Key</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc; 
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 16px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: 700; 
        }
        .header p { 
          margin: 10px 0 0 0; 
          opacity: 0.9; 
          font-size: 16px; 
        }
        .content { 
          padding: 40px 30px; 
        }
        .license-box { 
          background: #f8fafc; 
          border: 2px dashed #3b82f6; 
          border-radius: 12px; 
          padding: 24px; 
          text-align: center; 
          margin: 20px 0; 
        }
        .license-key { 
          font-family: 'Courier New', monospace; 
          font-size: 20px; 
          font-weight: bold; 
          color: #1e40af; 
          letter-spacing: 2px; 
          margin: 10px 0; 
        }
        .instructions { 
          background: #eff6ff; 
          border-left: 4px solid #3b82f6; 
          padding: 20px; 
          margin: 20px 0; 
        }
        .warning { 
          background: #fef3c7; 
          border-left: 4px solid #f59e0b; 
          padding: 20px; 
          margin: 20px 0; 
        }
        .footer { 
          background: #f8fafc; 
          padding: 30px; 
          text-align: center; 
          color: #64748b; 
          font-size: 14px; 
        }
        .btn { 
          display: inline-block; 
          background: #3b82f6; 
          color: white; 
          text-decoration: none; 
          padding: 12px 24px; 
          border-radius: 8px; 
          font-weight: 600; 
          margin: 10px 0; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌱 Seed Website Admin</h1>
          <p>Your Admin License Key</p>
        </div>
        
        <div class="content">
          <h2>Welcome to Seed Website Admin Portal!</h2>
          
          <p>You have requested access to the Seed Website Admin Portal. Please use the license key below to complete your admin registration:</p>
          
          <div class="license-box">
            <h3>Your License Key:</h3>
            <div class="license-key">${licenseKey}</div>
            <p><small>This key is valid for 24 hours</small></p>
          </div>
          
          <div class="instructions">
            <h4>📋 Instructions:</h4>
            <ol>
              <li>Go to the admin signup page</li>
              <li>Enter your email and desired password</li>
              <li>Paste the license key above</li>
              <li>Complete your registration</li>
            </ol>
          </div>
          
          <div class="warning">
            <h4>⚠️ Important:</h4>
            <ul>
              <li>This license key expires in <strong>24 hours</strong></li>
              <li>The key can only be used <strong>once</strong></li>
              <li>Keep this key secure and don't share it</li>
              <li>Only one admin account can be created</li>
            </ul>
          </div>
          
          <p>If you didn't request this license key, please ignore this email.</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Seed Website. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Seed Website Admin',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🔐 Your Admin License Key - Seed Website',
      html: htmlContent,
      text: `
        Seed Website Admin License Key
        
        Your license key: ${licenseKey}
        
        This key is valid for 24 hours and can only be used once.
        
        Instructions:
        1. Go to the admin signup page
        2. Enter your email and password
        3. Use the license key: ${licenseKey}
        4. Complete your registration
        
        If you didn't request this, please ignore this email.
        
        © 2024 Seed Website
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ License key email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send order notification to admin
 */
export const sendOrderNotificationToAdmin = async (order) => {
  try {
    const transporter = createTransporter();

    const productsHtml = order.products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.quantity} ${product.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .customer-details { background: #eff6ff; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .urgent-badge { background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Order Received!</h1>
          <p>A new order has been submitted and requires your attention</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>📋 Order Information</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> <span class="urgent-badge">${order.status.toUpperCase()}</span></p>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            <p><strong>Received:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          </div>
          
          <div class="customer-details">
            <h3>👤 Customer Details</h3>
            <p><strong>Name:</strong> ${order.customerInfo.name}</p>
            <p><strong>Email:</strong> ${order.customerInfo.email}</p>
            <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
            ${order.customerInfo.company ? `<p><strong>Company:</strong> ${order.customerInfo.company}</p>` : ''}
          </div>
          
          <h3>📦 Ordered Products</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          ${order.requirements ? `
          <div class="order-info">
            <h3>📝 Special Requirements</h3>
            <p>${order.requirements}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/admin" style="
              display: inline-block;
              background: #ef4444;
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              margin: 10px;
            ">View in Admin Panel</a>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 Seed Website Admin System</p>
          <p>This is an automated notification. Please review and respond promptly.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Seed Website System',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER, // Send to admin email
      subject: `🚨 New Order ${order.orderNumber} - Immediate Attention Required`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Order notification sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Admin notification failed:', error);
    throw new Error(`Failed to send admin notification: ${error.message}`);
  }
};

/**
 * Send order confirmation to customer
 */
export const sendOrderConfirmationToCustomer = async (order) => {
  try {
    const transporter = createTransporter();

    const productsHtml = order.products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.quantity} ${product.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .order-info { background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .next-steps { background: #eff6ff; padding: 20px; border-radius: 12px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmation</h1>
          <p>Thank you for your order! We've received your request.</p>
        </div>
        
        <div class="content">
          <h2>Hello ${order.customerInfo.name}!</h2>
          
          <p>We've successfully received your order and our team is reviewing it. You'll receive a detailed quote within 24 hours.</p>
          
          <div class="order-info">
            <h3>📋 Your Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          </div>
          
          <h3>📦 Ordered Products</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          ${order.requirements ? `
          <div class="order-info">
            <h3>📝 Your Special Requirements</h3>
            <p>${order.requirements}</p>
          </div>
          ` : ''}
          
          <div class="next-steps">
            <h3>🔄 What Happens Next?</h3>
            <ol>
              <li><strong>Review:</strong> Our team will review your order within 2-4 hours</li>
              <li><strong>Quote:</strong> You'll receive a detailed quote via email within 24 hours</li>
              <li><strong>Confirmation:</strong> Confirm your order and proceed with payment</li>
              <li><strong>Processing:</strong> We'll process and prepare your order</li>
              <li><strong>Delivery:</strong> Your products will be shipped as per agreed timeline</li>
            </ol>
          </div>
          
          <p>If you have any questions, please contact us at:</p>
          <p>📧 Email: ${process.env.EMAIL_USER}<br>
             📞 Phone: +1 (555) 123-4567</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Seed Website. All rights reserved.</p>
          <p>Thank you for choosing us for your agricultural needs!</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Seed Website',
        address: process.env.EMAIL_USER
      },
      to: order.customerInfo.email,
      subject: `Order Confirmation - ${order.orderNumber} | Seed Website`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Order confirmation sent to customer:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Customer confirmation failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send admin welcome email
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome Admin</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc; 
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 16px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .content { 
          padding: 40px 30px; 
        }
        .footer { 
          background: #f8fafc; 
          padding: 30px; 
          text-align: center; 
          color: #64748b; 
          font-size: 14px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Admin Portal!</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${name}!</h2>
          
          <p>Congratulations! Your admin account has been successfully created.</p>
          
          <p>You now have access to the Seed Website Admin Portal where you can:</p>
          
          <ul>
            <li>📊 View analytics and insights</li>
            <li>📋 Manage orders and customers</li>
            <li>📦 Handle product inventory</li>
            <li>⚙️ Configure system settings</li>
          </ul>
          
          <p>Your admin journey starts now. Welcome aboard!</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Seed Website. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Seed Website',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🎉 Welcome to Seed Website Admin Portal',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Welcome email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    // Don't throw error for welcome email failure
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send admin notification when customer confirms an order
 */
export const sendOrderConfirmationNotificationToAdmin = async (order) => {
  try {
    const transporter = createTransporter();

    const productsHtml = order.products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.quantity} ${product.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed by Customer</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .order-info { background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; }
        .customer-details { background: #eff6ff; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .confirmed-badge { background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .amount-highlight { background: #fef3c7; padding: 12px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>A customer has confirmed their order and is ready to proceed</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>📋 Order Information</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> <span class="confirmed-badge">${order.status.toUpperCase()}</span></p>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            <p><strong>Confirmed:</strong> ${new Date(order.confirmedAt || order.updatedAt).toLocaleString()}</p>
          </div>
          
          ${order.quotedPrice ? `
          <div class="amount-highlight">
            <h3>💰 Quoted Amount: $${order.quotedPrice.toLocaleString()}</h3>
            <p>Customer has accepted this quote and is ready to proceed with payment</p>
          </div>
          ` : ''}
          
          <div class="customer-details">
            <h3>👤 Customer Details</h3>
            <p><strong>Name:</strong> ${order.customerInfo.name}</p>
            <p><strong>Email:</strong> ${order.customerInfo.email}</p>
            <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
            ${order.customerInfo.company ? `<p><strong>Company:</strong> ${order.customerInfo.company}</p>` : ''}
          </div>
          
          <h3>📦 Confirmed Products</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          ${order.requirements ? `
          <div class="order-info">
            <h3>📝 Special Requirements</h3>
            <p>${order.requirements}</p>
          </div>
          ` : ''}
          
          ${order.adminNotes ? `
          <div class="order-info">
            <h3>📋 Admin Notes</h3>
            <p>${order.adminNotes}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <p><strong>🚨 Action Required:</strong> Customer has confirmed the order. Please proceed with processing and payment collection.</p>
            <a href="${process.env.FRONTEND_URL}/admin" style="
              display: inline-block;
              background: #10b981;
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              margin: 10px;
            ">Process Order in Admin Panel</a>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 Seed Website Admin System</p>
          <p>This order confirmation requires immediate action. Please process payment and shipping.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Seed Website System',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER, // Send to admin email
      subject: `✅ Order ${order.orderNumber} CONFIRMED - Payment & Processing Required`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Order confirmation notification sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Admin confirmation notification failed:', error);
    throw new Error(`Failed to send admin confirmation notification: ${error.message}`);
  }
};

/**
 * Send order status update notification to customer
 */
export const sendOrderStatusUpdateToCustomer = async (order, newStatus, oldStatus) => {
  try {
    console.log(`📧 Sending status update email to ${order.customerInfo.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Status: ${oldStatus} → ${newStatus}`);
    
    const transporter = createTransporter();

    const statusMessages = {
      pending: {
        title: '⏳ Order Received',
        message: 'Your order has been received and is pending review.',
        action: 'Our team will review your order and get back to you within 24 hours.'
      },
      reviewed: {
        title: '👁️ Order Under Review',
        message: 'Your order is currently being reviewed by our team.',
        action: 'We are preparing a detailed quote for your requirements.'
      },
      quoted: {
        title: '💰 Quote Ready',
        message: 'We have prepared a quote for your order.',
        action: 'Please review the quote and confirm your order to proceed with payment.'
      },
      confirmed: {
        title: '✅ Order Confirmed',
        message: 'Your order has been confirmed and accepted.',
        action: 'We will contact you shortly for payment details and processing.'
      },
      processing: {
        title: '⚙️ Order Processing',
        message: 'Your order is now being processed.',
        action: 'We are preparing your products for shipment.'
      },
      shipped: {
        title: '🚚 Order Shipped',
        message: 'Your order has been shipped and is on its way!',
        action: 'You will receive tracking details and delivery updates.'
      },
      delivered: {
        title: '📦 Order Delivered',
        message: 'Your order has been successfully delivered.',
        action: 'Thank you for choosing us! Please let us know if you need anything else.'
      },
      cancelled: {
        title: '❌ Order Cancelled',
        message: 'Your order has been cancelled.',
        action: 'If you have any questions, please contact our support team.'
      }
    };

    const statusInfo = statusMessages[newStatus] || {
      title: '📋 Order Status Updated',
      message: `Your order status has been updated to ${newStatus}.`,
      action: 'Please contact us if you have any questions.'
    };

    const productsHtml = order.products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.quantity} ${product.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .status-update { background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .status-badge { background: #3b82f6; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; text-transform: uppercase; }
        .progress-bar { background: #e5e7eb; height: 8px; border-radius: 4px; margin: 20px 0; overflow: hidden; }
        .progress-fill { background: linear-gradient(135deg, #3b82f6, #1e40af); height: 100%; transition: width 0.3s ease; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusInfo.title}</h1>
          <p>Order ${order.orderNumber} Status Update</p>
        </div>
        
        <div class="content">
          <h2>Hello ${order.customerInfo.name}!</h2>
          
          <div class="status-update">
            <h3>📋 Status Update</h3>
            <p><strong>Previous Status:</strong> ${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</p>
            <p><strong>Current Status:</strong> <span class="status-badge">${newStatus.toUpperCase()}</span></p>
            <p>${statusInfo.message}</p>
          </div>
          
          <div class="order-info">
            <h3>📦 Order Information</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            ${order.quotedPrice ? `<p><strong>Quoted Price:</strong> $${order.quotedPrice.toLocaleString()}</p>` : ''}
          </div>
          
          <h3>📦 Your Products</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          ${order.requirements ? `
          <div class="order-info">
            <h3>📝 Your Requirements</h3>
            <p>${order.requirements}</p>
          </div>
          ` : ''}
          
          ${order.adminNotes ? `
          <div class="order-info">
            <h3>📋 Notes from Our Team</h3>
            <p>${order.adminNotes}</p>
          </div>
          ` : ''}
          
          <div class="status-update">
            <h3>🔄 What's Next?</h3>
            <p>${statusInfo.action}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p>If you have any questions, please don't hesitate to contact us:</p>
            <p>📧 Email: ${process.env.EMAIL_USER}<br>
               📞 Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 Seed Website. All rights reserved.</p>
          <p>Thank you for choosing us for your agricultural needs!</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Seed Website',
        address: process.env.EMAIL_USER
      },
      to: order.customerInfo.email,
      subject: `${statusInfo.title} - Order ${order.orderNumber} | Seed Website`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Order status update sent to customer: ${order.customerInfo.email}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Accepted: ${JSON.stringify(info.accepted)}`);
    console.log(`   Rejected: ${JSON.stringify(info.rejected)}`);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Customer status update failed for ${order.customerInfo.email}:`, error);
    console.error(`   Order: ${order.orderNumber}`);
    console.error(`   Error details:`, {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return { success: false, error: error.message };
  }
};

/**
 * Send quote notification email to customer (specialized for quotes)
 */
export const sendQuoteNotificationToCustomer = async (order) => {
  try {
    console.log(`💰 Sending quote email to ${order.customerInfo.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Quote: $${order.quotedPrice}`);
    
    const transporter = createTransporter();

    const productsHtml = order.products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.quantity} ${product.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Quote is Ready!</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .quote-box { background: #fef3c7; padding: 24px; border-radius: 12px; margin: 20px 0; border: 2px solid #f59e0b; text-align: center; }
        .quote-amount { font-size: 36px; font-weight: bold; color: #92400e; margin: 10px 0; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .cta-button { display: inline-block; background: #f59e0b; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .delivery-info { background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3b82f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Your Quote is Ready!</h1>
          <p>Order ${order.orderNumber}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${order.customerInfo.name}!</h2>
          
          <p>Great news! We've prepared a detailed quote for your order. Please review the details below:</p>
          
          <div class="quote-box">
            <h3>💵 Your Quote</h3>
            <div class="quote-amount">$${order.quotedPrice.toLocaleString()}</div>
            <p><strong>Valid for 30 days</strong></p>
          </div>
          
          <div class="order-info">
            <h3>📋 Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            <p><strong>Quote Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          ${order.expectedDelivery ? `
          <div class="delivery-info">
            <h3>🚚 Expected Delivery</h3>
            <p><strong>Estimated Delivery:</strong> ${new Date(order.expectedDelivery).toLocaleDateString()}</p>
          </div>
          ` : ''}
          
          <h3>📦 Quoted Products</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          ${order.adminNotes ? `
          <div class="order-info">
            <h3>📝 Terms & Conditions</h3>
            <p>${order.adminNotes}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <h3>Ready to proceed?</h3>
            <p>To confirm this order and proceed with payment, please contact us:</p>
            <a href="mailto:${process.env.EMAIL_USER}?subject=Order Confirmation - ${order.orderNumber}" class="cta-button">
              ✅ Confirm Order
            </a>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h4>🔄 Next Steps:</h4>
            <ol>
              <li>Review your quote and terms above</li>
              <li>Contact us to confirm your order</li>
              <li>Arrange payment details</li>
              <li>We'll process and ship your products</li>
            </ol>
          </div>
          
          <p><strong>Questions?</strong> Contact us:</p>
          <p>📧 Email: ${process.env.EMAIL_USER}<br>
             📞 Phone: +1 (555) 123-4567</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Seed Website. All rights reserved.</p>
          <p>This quote is valid for 30 days from the date issued.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Seed Website - Quote Team',
        address: process.env.EMAIL_USER
      },
      to: order.customerInfo.email,
      subject: `💰 Your Quote is Ready! $${order.quotedPrice.toLocaleString()} - Order ${order.orderNumber}`,
      html: htmlContent,
      // Add plain text fallback
      text: `
        Your Quote is Ready - Order ${order.orderNumber}
        
        Hello ${order.customerInfo.name},
        
        We've prepared a quote for your order:
        
        Quote Amount: $${order.quotedPrice.toLocaleString()}
        Order Number: ${order.orderNumber}
        Total Items: ${order.totalItems}
        
        ${order.expectedDelivery ? `Expected Delivery: ${new Date(order.expectedDelivery).toLocaleDateString()}` : ''}
        
        Products:
        ${order.products.map(p => `- ${p.name}: ${p.quantity} ${p.unit}`).join('\n        ')}
        
        ${order.adminNotes ? `Terms & Conditions: ${order.adminNotes}` : ''}
        
        To confirm this order, please contact us at ${process.env.EMAIL_USER}
        
        Thank you for choosing Seed Website!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Quote email sent to customer: ${order.customerInfo.email}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Subject: ${mailOptions.subject}`);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Quote email failed for ${order.customerInfo.email}:`, error);
    console.error(`   Order: ${order.orderNumber}`);
    return { success: false, error: error.message };
  }
};

/**
 * Test email functionality
 */
export const sendTestEmail = async (toEmail) => {
  try {
    console.log(`🧪 Sending test email to ${toEmail}`);
    
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Seed Website Test',
        address: process.env.EMAIL_USER
      },
      to: toEmail,
      subject: '🧪 Email Test - Seed Website System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981;">Email Test Successful! ✅</h2>
          <p>This is a test email from the Seed Website system.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
          <p>If you received this email, the email system is working correctly!</p>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4>System Status:</h4>
            <ul>
              <li>✅ SMTP Connection: Working</li>
              <li>✅ Email Templates: Loading</li>
              <li>✅ Delivery System: Active</li>
            </ul>
          </div>
        </div>
      `,
      text: `
        Email Test Successful!
        
        This is a test email from the Seed Website system.
        Time: ${new Date().toLocaleString()}
        From: ${process.env.EMAIL_USER}
        
        If you received this email, the email system is working correctly!
        
        System Status:
        - SMTP Connection: Working
        - Email Templates: Loading  
        - Delivery System: Active
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Test email sent successfully: ${info.messageId}`);
    console.log(`   To: ${toEmail}`);
    console.log(`   Accepted: ${JSON.stringify(info.accepted)}`);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Test email failed:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order confirmation with invoice PDF attachment
 */
export const sendOrderConfirmationWithInvoice = async (order) => {
  let tempPDFPath = null;
  
  try {
    console.log(`📧📄 Sending order confirmation with invoice PDF to ${order.customerInfo.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    
    const transporter = createTransporter();

    // Generate invoice PDF
    const pdfResult = await generateInvoicePDF(order);
    if (!pdfResult.success) {
      throw new Error('Failed to generate invoice PDF');
    }

    // Save PDF to temporary file for email attachment
    tempPDFPath = await savePDFToTemp(pdfResult.buffer, pdfResult.filename);

    const productsHtml = order.products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.quantity} ${product.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation with Invoice</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .order-info { background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .invoice-info { background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .attachment-note { background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3b82f6; }
        .cta-button { display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmation & Invoice</h1>
          <p>Thank you for your order! Your invoice is attached.</p>
        </div>
        
        <div class="content">
          <h2>Hello ${order.customerInfo.name}!</h2>
          
          <p>We've successfully received your order request. Your detailed invoice is attached to this email as a PDF document.</p>
          
          <div class="attachment-note">
            <h3>📎 Invoice Attached</h3>
            <p><strong>Invoice Number:</strong> ${pdfResult.invoiceNumber}</p>
            <p><strong>File:</strong> ${pdfResult.filename}</p>
            <p>Please review the attached invoice for complete pricing and terms.</p>
          </div>
          
          <div class="order-info">
            <h3>📋 Your Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          </div>
          
          <h3>📦 Ordered Products</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          ${order.requirements ? `
          <div class="order-info">
            <h3>📝 Your Special Requirements</h3>
            <p>${order.requirements}</p>
          </div>
          ` : ''}
          
          <div class="invoice-info">
            <h3>🔄 What Happens Next?</h3>
            <ol>
              <li><strong>Review:</strong> Please review the attached invoice for pricing and terms</li>
              <li><strong>Confirmation:</strong> Contact us to confirm your order if you agree to the terms</li>
              <li><strong>Payment:</strong> We'll provide payment instructions upon confirmation</li>
              <li><strong>Processing:</strong> Your order will be processed after payment</li>
              <li><strong>Delivery:</strong> Products will be shipped as per agreed timeline</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${process.env.EMAIL_USER}?subject=Order Confirmation - ${order.orderNumber}" class="cta-button">
              ✅ Confirm Order
            </a>
          </div>
          
          <p>If you have any questions about your invoice or order, please contact us at:</p>
          <p>📧 Email: ${process.env.EMAIL_USER}<br>
             📞 Phone: +1 (555) 123-4567</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Field to Feed Export. All rights reserved.</p>
          <p>Thank you for choosing us for your agricultural needs!</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Field to Feed Export',
        address: process.env.EMAIL_USER
      },
      to: order.customerInfo.email,
      subject: `📧📄 Order Confirmation & Invoice - ${order.orderNumber} | Field to Feed Export`,
      html: htmlContent,
      attachments: [
        {
          filename: pdfResult.filename,
          path: tempPDFPath,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Order confirmation with invoice sent to customer: ${order.customerInfo.email}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Invoice: ${pdfResult.filename}`);
    
    // Clean up temporary PDF file
    await cleanupTempPDF(tempPDFPath);
    
    return { 
      success: true, 
      messageId: info.messageId,
      invoiceNumber: pdfResult.invoiceNumber,
      filename: pdfResult.filename
    };

  } catch (error) {
    console.error(`❌ Order confirmation with invoice failed for ${order.customerInfo.email}:`, error);
    
    // Clean up temporary PDF file in case of error
    if (tempPDFPath) {
      await cleanupTempPDF(tempPDFPath);
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Send quote email with invoice PDF attachment
 */
export const sendQuoteWithInvoicePDF = async (order) => {
  let tempPDFPath = null;
  
  try {
    console.log(`💰📄 Sending quote with invoice PDF to ${order.customerInfo.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Quote: $${order.quotedPrice}`);
    
    const transporter = createTransporter();

    // Generate invoice PDF
    const pdfResult = await generateInvoicePDF(order);
    if (!pdfResult.success) {
      throw new Error('Failed to generate invoice PDF');
    }

    // Save PDF to temporary file for email attachment
    tempPDFPath = await savePDFToTemp(pdfResult.buffer, pdfResult.filename);

    const productsHtml = order.products.map(product => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.quantity} ${product.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Quote with Invoice</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .quote-box { background: #fef3c7; padding: 24px; border-radius: 12px; margin: 20px 0; border: 2px solid #f59e0b; text-align: center; }
        .quote-amount { font-size: 36px; font-weight: bold; color: #92400e; margin: 10px 0; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .cta-button { display: inline-block; background: #f59e0b; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .delivery-info { background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3b82f6; }
        .attachment-note { background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3b82f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰📄 Your Quote & Invoice Ready!</h1>
          <p>Order ${order.orderNumber}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${order.customerInfo.name}!</h2>
          
          <p>Great news! We've prepared a detailed quote for your order. The complete invoice is attached as a PDF for your records.</p>
          
          <div class="attachment-note">
            <h3>📎 Professional Invoice Attached</h3>
            <p><strong>Invoice Number:</strong> ${pdfResult.invoiceNumber}</p>
            <p><strong>File:</strong> ${pdfResult.filename}</p>
            <p>This PDF contains detailed pricing, terms, and payment information.</p>
          </div>
          
          <div class="quote-box">
            <h3>💵 Your Quote</h3>
            <div class="quote-amount">$${order.quotedPrice.toLocaleString()}</div>
            <p><strong>Valid for 30 days</strong></p>
          </div>
          
          <div class="order-info">
            <h3>📋 Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            <p><strong>Quote Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          ${order.expectedDelivery ? `
          <div class="delivery-info">
            <h3>🚚 Expected Delivery</h3>
            <p><strong>Estimated Delivery:</strong> ${new Date(order.expectedDelivery).toLocaleDateString()}</p>
          </div>
          ` : ''}
          
          <h3>📦 Quoted Products</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          
          ${order.adminNotes ? `
          <div class="order-info">
            <h3>📝 Terms & Conditions</h3>
            <p>${order.adminNotes}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <h3>Ready to proceed?</h3>
            <p>Review the attached invoice and contact us to confirm your order:</p>
            <a href="mailto:${process.env.EMAIL_USER}?subject=Order Confirmation - ${order.orderNumber}" class="cta-button">
              ✅ Confirm Order
            </a>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h4>🔄 Next Steps:</h4>
            <ol>
              <li>Review your quote and attached invoice</li>
              <li>Contact us to confirm your order</li>
              <li>Arrange payment details</li>
              <li>We'll process and ship your products</li>
            </ol>
          </div>
          
          <p><strong>Questions?</strong> Contact us:</p>
          <p>📧 Email: ${process.env.EMAIL_USER}<br>
             📞 Phone: +1 (555) 123-4567</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Field to Feed Export. All rights reserved.</p>
          <p>This quote is valid for 30 days from the date issued.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: {
        name: 'Field to Feed Export - Quote Team',
        address: process.env.EMAIL_USER
      },
      to: order.customerInfo.email,
      subject: `💰📄 Your Quote & Invoice Ready! $${order.quotedPrice.toLocaleString()} - Order ${order.orderNumber}`,
      html: htmlContent,
      attachments: [
        {
          filename: pdfResult.filename,
          path: tempPDFPath,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Quote with invoice PDF sent to customer: ${order.customerInfo.email}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Invoice: ${pdfResult.filename}`);
    
    // Clean up temporary PDF file
    await cleanupTempPDF(tempPDFPath);
    
    return { 
      success: true, 
      messageId: info.messageId,
      invoiceNumber: pdfResult.invoiceNumber,
      filename: pdfResult.filename
    };

  } catch (error) {
    console.error(`❌ Quote with invoice PDF failed for ${order.customerInfo.email}:`, error);
    
    // Clean up temporary PDF file in case of error
    if (tempPDFPath) {
      await cleanupTempPDF(tempPDFPath);
    }
    
    return { success: false, error: error.message };
  }
};
