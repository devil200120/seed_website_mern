import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate Invoice PDF from order data
 */
export const generateInvoicePDF = async (order) => {
  let browser;
  
  try {
    // Invoice data
    const invoiceNumber = `INV-${order.orderNumber?.replace('ORD-', '') || '000001'}`;
    const invoiceDate = new Date().toLocaleDateString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 30 days from now

    // Calculate totals using enhanced price calculation
    let subtotal, taxAmount, total;
    
    if (order.priceCalculation && order.priceCalculation.subtotal) {
      // Use the pre-calculated price data from the new system
      subtotal = order.priceCalculation.subtotal;
      taxAmount = order.priceCalculation.taxAmount;
      total = order.priceCalculation.total;
    } else {
      // Fallback to old calculation method
      subtotal = order.products?.reduce((sum, product) => {
        return sum + ((product.estimatedPrice || 0) * product.quantity);
      }, 0) || order.quotedPrice || 0;
      
      const taxRate = 0.18; // 18% tax
      taxAmount = subtotal * taxRate;
      total = subtotal + taxAmount;
    }

    // Generate products table HTML
    const productsHTML = order.products?.map(product => {
      const unitPrice = product.estimatedPrice || 0;
      const lineTotal = product.lineTotal || (unitPrice * product.quantity);
      
      return `
        <tr>
          <td>
            <strong>${product.name}</strong>
            ${product.notes ? `<br><small style="color: #666; font-style: italic;">${product.notes}</small>` : ''}
          </td>
          <td>${product.category}</td>
          <td>${product.quantity.toLocaleString()}</td>
          <td>${product.unit}</td>
          <td>$${unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="text-align: right; font-weight: 600;">$${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    }).join('') || '';

    // HTML template for invoice
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          font-size: 14px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 30px;
        }
        
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2c5530;
        }
        
        .company-info h1 {
          font-size: 32px;
          font-weight: 700;
          color: #2c5530;
          margin-bottom: 5px;
        }
        
        .company-info .tagline {
          color: #666;
          font-style: italic;
          margin-bottom: 15px;
        }
        
        .company-details {
          font-size: 12px;
          color: #555;
          line-height: 1.4;
        }
        
        .invoice-details {
          text-align: right;
        }
        
        .invoice-details h2 {
          font-size: 28px;
          color: #2c5530;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        .invoice-meta {
          font-size: 12px;
          line-height: 1.6;
        }
        
        .invoice-meta strong {
          color: #2c5530;
        }
        
        .invoice-parties {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 40px;
        }
        
        .bill-to, .ship-to {
          flex: 1;
        }
        
        .bill-to h3, .ship-to h3 {
          color: #2c5530;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .customer-details, .order-status {
          font-size: 12px;
          line-height: 1.5;
        }
        
        .customer-details p {
          margin: 3px 0;
        }
        
        .delivery-address {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #eee;
        }
        
        .delivery-address strong {
          color: #2c5530;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #d1ecf1;
          color: #0c5460;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 12px;
        }
        
        .items-table th {
          background: #f8f9fa;
          color: #2c5530;
          font-weight: 600;
          padding: 12px 8px;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
        }
        
        .items-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #dee2e6;
          vertical-align: top;
        }
        
        .items-table tr:hover {
          background: #f8f9fa;
        }
        
        .totals-section {
          margin-left: auto;
          width: 300px;
          margin-top: 20px;
        }
        
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #eee;
          font-size: 13px;
        }
        
        .totals-row.shipping {
          border-bottom: 2px solid #dee2e6;
        }
        
        .totals-row.total {
          border-top: 2px solid #2c5530;
          border-bottom: none;
          padding: 12px 0 0;
          font-size: 16px;
          font-weight: 700;
          color: #2c5530;
        }
        
        .payment-info {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
          gap: 30px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        
        .payment-terms, .additional-info {
          flex: 1;
        }
        
        .payment-terms h3, .additional-info h3 {
          color: #2c5530;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .payment-details p, .requirements p, .admin-notes p {
          margin: 3px 0;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .requirements, .admin-notes {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #dee2e6;
        }
        
        .invoice-footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #2c5530;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 15px;
        }
        
        .terms, .contact-info {
          flex: 1;
        }
        
        .terms h4, .contact-info h4 {
          color: #2c5530;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .terms ul {
          margin: 0;
          padding-left: 15px;
        }
        
        .terms li {
          margin: 3px 0;
          font-size: 10px;
          line-height: 1.3;
          color: #666;
        }
        
        .contact-info p {
          margin: 2px 0;
          font-size: 10px;
          color: #666;
        }
        
        .invoice-stamp {
          text-align: center;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        
        .invoice-stamp strong {
          color: #2c5530;
          font-size: 14px;
        }
        
        .invoice-stamp small {
          color: #666;
          font-size: 9px;
          display: block;
          margin-top: 3px;
        }
        
        @media print {
          .invoice-container {
            max-width: none;
            margin: 0;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Invoice Header -->
        <div class="invoice-header">
          <div class="company-info">
            <h1>Field to Feed Export</h1>
            <p class="tagline">Premium Agricultural Products</p>
            <div class="company-details">
              <p>📍 Agriculture Business Hub, Farm District</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📧 orders@fieldtofeed.com</p>
              <p>🌐 www.fieldtofeed.com</p>
            </div>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <div class="invoice-meta">
              <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
              <p><strong>Due Date:</strong> ${dueDate}</p>
              <p><strong>Order No:</strong> ${order.orderNumber}</p>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="invoice-parties">
          <div class="bill-to">
            <h3>Bill To:</h3>
            <div class="customer-details">
              <p><strong>${order.customerInfo?.name}</strong></p>
              ${order.customerInfo?.company ? `<p>${order.customerInfo.company}</p>` : ''}
              <p>📧 ${order.customerInfo?.email}</p>
              <p>📞 ${order.customerInfo?.phone}</p>
              ${order.deliveryAddress ? `
                <div class="delivery-address">
                  <p><strong>Delivery Address:</strong></p>
                  <p>${order.deliveryAddress.street}</p>
                  <p>${order.deliveryAddress.city}, ${order.deliveryAddress.state}</p>
                  <p>${order.deliveryAddress.country} - ${order.deliveryAddress.zipCode}</p>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="ship-to">
            <h3>Status:</h3>
            <div class="order-status">
              <span class="status-badge">
                ${order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
              ${order.quotedAt ? `<p><small>Quoted: ${new Date(order.quotedAt).toLocaleDateString()}</small></p>` : ''}
              ${order.confirmedAt ? `<p><small>Confirmed: ${new Date(order.confirmedAt).toLocaleDateString()}</small></p>` : ''}
            </div>
          </div>
        </div>

        <!-- Products Table -->
        <div class="invoice-items">
          <table class="items-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsHTML}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="totals-row">
            <span>Tax (${order.priceCalculation?.taxRate ? (order.priceCalculation.taxRate * 100).toFixed(0) : '18'}%):</span>
            <span>$${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="totals-row shipping">
            <span>Shipping:</span>
            <span>TBD</span>
          </div>
          <div class="totals-row total">
            <span><strong>Total Amount:</strong></span>
            <span><strong>$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="payment-info">
          <div class="payment-terms">
            <h3>Payment Information</h3>
            <div class="payment-details">
              <p><strong>Payment Terms:</strong> Net 30 days</p>
              <p><strong>Payment Methods:</strong> Bank Transfer, Wire Transfer</p>
              <p><strong>Account Details:</strong> Will be provided upon order confirmation</p>
            </div>
          </div>
          
          <div class="additional-info">
            <h3>Additional Information</h3>
            ${order.requirements ? `
              <div class="requirements">
                <p><strong>Special Requirements:</strong></p>
                <p>${order.requirements}</p>
              </div>
            ` : ''}
            ${order.adminNotes ? `
              <div class="admin-notes">
                <p><strong>Notes:</strong></p>
                <p>${order.adminNotes}</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Footer -->
        <div class="invoice-footer">
          <div class="footer-content">
            <div class="terms">
              <h4>Terms & Conditions</h4>
              <ul>
                <li>Payment is due within 30 days of invoice date</li>
                <li>Late payments may incur additional charges</li>
                <li>All products are subject to quality inspection</li>
                <li>Delivery dates are estimated and subject to change</li>
                <li>Returns are accepted within 7 days of delivery</li>
              </ul>
            </div>
            
            <div class="contact-info">
              <h4>Contact Information</h4>
              <p>For any queries regarding this invoice:</p>
              <p>📧 billing@fieldtofeed.com</p>
              <p>📞 +1 (555) 123-4567 (Billing)</p>
              <p>⏰ Monday - Friday, 9 AM - 6 PM</p>
            </div>
          </div>
          
          <div class="invoice-stamp">
            <p><strong>Thank you for your business!</strong></p>
            <small>This is a computer-generated invoice and does not require a signature.</small>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      printBackground: true
    });

    await browser.close();

    console.log(`✅ PDF generated for invoice ${invoiceNumber}`);
    return {
      success: true,
      buffer: pdfBuffer,
      filename: `Invoice_${invoiceNumber}_${order.orderNumber}.pdf`,
      invoiceNumber
    };

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('❌ Failed to close browser:', closeError);
      }
    }
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

/**
 * Save PDF to temporary file (for email attachments)
 */
export const savePDFToTemp = async (pdfBuffer, filename) => {
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    const filePath = path.join(tempDir, filename);

    // Ensure temp directory exists
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }

    // Save buffer to file
    await fs.writeFile(filePath, pdfBuffer);

    console.log(`✅ PDF saved to: ${filePath}`);
    return filePath;

  } catch (error) {
    console.error('❌ Failed to save PDF to temp:', error);
    throw new Error(`Failed to save PDF: ${error.message}`);
  }
};

/**
 * Clean up temporary PDF files
 */
export const cleanupTempPDF = async (filePath) => {
  try {
    if (filePath && await fs.access(filePath).then(() => true).catch(() => false)) {
      await fs.unlink(filePath);
      console.log(`🗑️ Cleaned up temp PDF: ${filePath}`);
    }
  } catch (error) {
    console.error('❌ Failed to cleanup temp PDF:', error);
    // Don't throw error for cleanup failure
  }
};

export default {
  generateInvoicePDF,
  savePDFToTemp,
  cleanupTempPDF
};