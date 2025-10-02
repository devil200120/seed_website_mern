import { useState, useRef } from "react";
import "./Invoice.css";

function Invoice({ order, onClose }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef();

  if (!order) return null;

  const invoiceNumber = `INV-${
    order.orderNumber?.replace("ORD-", "") || "000001"
  }`;
  const invoiceDate = new Date().toLocaleDateString();
  const dueDate = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString(); // 30 days from now

  const subtotal =
    order.products?.reduce((sum, product) => {
      return sum + (product.estimatedPrice || 0) * product.quantity;
    }, 0) ||
    order.quotedPrice ||
    0;

  const taxRate = 0.18; // 18% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // You can integrate with libraries like jsPDF or html2canvas here
      // For now, we'll use the browser's print to PDF functionality
      window.print();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="invoice-overlay" onClick={onClose}>
      <div
        className="invoice-container"
        onClick={(e) => e.stopPropagation()}
        ref={invoiceRef}
      >
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="company-info">
            <h1>Field to Feed Export</h1>
            <p>Premium Agricultural Products</p>
            <div className="company-details">
              <p>📍 Agriculture Business Hub, Farm District</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📧 orders@fieldtofeed.com</p>
              <p>🌐 www.fieldtofeed.com</p>
            </div>
          </div>
          <div className="invoice-details">
            <h2>INVOICE</h2>
            <div className="invoice-meta">
              <p>
                <strong>Invoice No:</strong> {invoiceNumber}
              </p>
              <p>
                <strong>Invoice Date:</strong> {invoiceDate}
              </p>
              <p>
                <strong>Due Date:</strong> {dueDate}
              </p>
              <p>
                <strong>Order No:</strong> {order.orderNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="invoice-parties">
          <div className="bill-to">
            <h3>Bill To:</h3>
            <div className="customer-details">
              <p>
                <strong>{order.customerInfo?.name}</strong>
              </p>
              {order.customerInfo?.company && (
                <p>{order.customerInfo.company}</p>
              )}
              <p>📧 {order.customerInfo?.email}</p>
              <p>📞 {order.customerInfo?.phone}</p>
              {order.deliveryAddress && (
                <div className="delivery-address">
                  <p>
                    <strong>Delivery Address:</strong>
                  </p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}
                  </p>
                  <p>
                    {order.deliveryAddress.country} -{" "}
                    {order.deliveryAddress.zipCode}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="ship-to">
            <h3>Status:</h3>
            <div className="order-status">
              <span className={`status-badge ${order.status}`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
              {order.quotedAt && (
                <p>
                  <small>
                    Quoted: {new Date(order.quotedAt).toLocaleDateString()}
                  </small>
                </p>
              )}
              {order.confirmedAt && (
                <p>
                  <small>
                    Confirmed:{" "}
                    {new Date(order.confirmedAt).toLocaleDateString()}
                  </small>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="invoice-items">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.map((product, index) => {
                const unitPrice = product.estimatedPrice || 0;
                const lineTotal = unitPrice * product.quantity;

                return (
                  <tr key={index}>
                    <td>
                      <div className="item-description">
                        <strong>{product.name}</strong>
                        {product.notes && (
                          <small className="item-notes">{product.notes}</small>
                        )}
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unit}</td>
                    <td>${unitPrice.toFixed(2)}</td>
                    <td>${lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="totals-section">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>Tax (18%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="totals-row shipping">
              <span>Shipping:</span>
              <span>TBD</span>
            </div>
            <div className="totals-row total">
              <span>
                <strong>Total Amount:</strong>
              </span>
              <span>
                <strong>${total.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="payment-info">
          <div className="payment-terms">
            <h3>Payment Information</h3>
            <div className="payment-details">
              <p>
                <strong>Payment Terms:</strong> Net 30 days
              </p>
              <p>
                <strong>Payment Methods:</strong> Bank Transfer, Wire Transfer
              </p>
              <p>
                <strong>Account Details:</strong> Will be provided upon order
                confirmation
              </p>
            </div>
          </div>

          <div className="additional-info">
            <h3>Additional Information</h3>
            {order.requirements && (
              <div className="requirements">
                <p>
                  <strong>Special Requirements:</strong>
                </p>
                <p>{order.requirements}</p>
              </div>
            )}
            {order.adminNotes && (
              <div className="admin-notes">
                <p>
                  <strong>Notes:</strong>
                </p>
                <p>{order.adminNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">
          <div className="footer-content">
            <div className="terms">
              <h4>Terms & Conditions</h4>
              <ul>
                <li>Payment is due within 30 days of invoice date</li>
                <li>Late payments may incur additional charges</li>
                <li>All products are subject to quality inspection</li>
                <li>Delivery dates are estimated and subject to change</li>
                <li>Returns are accepted within 7 days of delivery</li>
              </ul>
            </div>

            <div className="contact-info">
              <h4>Contact Information</h4>
              <p>For any queries regarding this invoice:</p>
              <p>📧 billing@fieldtofeed.com</p>
              <p>📞 +1 (555) 123-4567 (Billing)</p>
              <p>⏰ Monday - Friday, 9 AM - 6 PM</p>
            </div>
          </div>

          <div className="invoice-stamp">
            <p>
              <strong>Thank you for your business!</strong>
            </p>
            <small>
              This is a computer-generated invoice and does not require a
              signature.
            </small>
          </div>
        </div>

        {/* Print Actions - Hidden in print */}
        <div className="invoice-actions no-print">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={handlePrintInvoice}>
            🖨️ Print Invoice
          </button>
          <button
            className="btn-primary"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? "📄 Generating..." : "📄 Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
