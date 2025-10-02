import { useState } from "react";
import { orderAPI } from "../services/api";
import Invoice from "./Invoice";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    customerEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setOrderDetails(null);

    try {
      const response = await orderAPI.confirmOrder(
        formData.orderNumber,
        formData.customerEmail
      );

      if (response.data.success) {
        setMessage("✅ Order confirmed successfully! Admin has been notified.");
        setOrderDetails(response.data.data.order);

        // Reset form
        setFormData({
          orderNumber: "",
          customerEmail: "",
        });
      }
    } catch (error) {
      console.error("Order confirmation error:", error);

      let errorMessage = "Failed to confirm order. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err) => err.message)
          .join(", ");
      }

      setMessage(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="order-confirmation" id="order-confirmation">
      <div className="container">
        <div className="confirmation-header">
          <h2>Confirm Your Order</h2>
          <p>
            Received a quote? Confirm your order to proceed with processing and
            payment.
          </p>
        </div>

        <div className="confirmation-form-container">
          <form onSubmit={handleSubmit} className="confirmation-form">
            <div className="form-group">
              <label htmlFor="orderNumber">Order Number *</label>
              <input
                type="text"
                id="orderNumber"
                placeholder="e.g., ORD-000123"
                value={formData.orderNumber}
                onChange={(e) =>
                  handleInputChange("orderNumber", e.target.value)
                }
                required
              />
              <small>Enter the order number from your quote email</small>
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email Address *</label>
              <input
                type="email"
                id="customerEmail"
                placeholder="Enter your email address"
                value={formData.customerEmail}
                onChange={(e) =>
                  handleInputChange("customerEmail", e.target.value)
                }
                required
              />
              <small>
                Use the same email address used for the original order
              </small>
            </div>

            {message && (
              <div
                className={`confirmation-message ${
                  message.includes("✅") ? "success" : "error"
                }`}
              >
                {message}
              </div>
            )}

            {orderDetails && (
              <div className="order-details-confirmation">
                <h3>Order Confirmed!</h3>
                <div className="order-summary">
                  <p>
                    <strong>Order Number:</strong> {orderDetails.orderNumber}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="status-confirmed">
                      {orderDetails.status}
                    </span>
                  </p>
                  {orderDetails.quotedPrice && (
                    <p>
                      <strong>Quoted Price:</strong> $
                      {orderDetails.quotedPrice.toLocaleString()}
                    </p>
                  )}
                  <p>
                    <strong>Confirmed At:</strong>{" "}
                    {new Date(orderDetails.confirmedAt).toLocaleString()}
                  </p>
                </div>
                <div className="next-steps">
                  <h4>What happens next?</h4>
                  <ul>
                    <li>✅ Admin has been notified of your confirmation</li>
                    <li>
                      📞 You will be contacted for payment details within 24
                      hours
                    </li>
                    <li>🚚 Processing and shipping will begin after payment</li>
                    <li>
                      📧 You'll receive updates via email throughout the process
                    </li>
                  </ul>

                  <div className="invoice-actions">
                    <button
                      type="button"
                      className="btn-secondary invoice-btn"
                      onClick={() => setShowInvoice(true)}
                    >
                      📄 View Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary confirm-btn"
                disabled={
                  isSubmitting ||
                  !formData.orderNumber ||
                  !formData.customerEmail
                }
              >
                {isSubmitting ? "Confirming..." : "Confirm Order"}
              </button>
            </div>
          </form>

          <div className="help-section">
            <h3>Need Help?</h3>
            <div className="help-items">
              <div className="help-item">
                <h4>📧 Can't find your order number?</h4>
                <p>
                  Check your email for the quote. The order number is in the
                  subject line and email body.
                </p>
              </div>
              <div className="help-item">
                <h4>❓ Order not ready for confirmation?</h4>
                <p>
                  Orders can only be confirmed after receiving a quote from our
                  team.
                </p>
              </div>
              <div className="help-item">
                <h4>📞 Need to modify your order?</h4>
                <p>
                  Contact us before confirming to make any changes to your
                  order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        {showInvoice && orderDetails && (
          <Invoice order={orderDetails} onClose={() => setShowInvoice(false)} />
        )}
      </div>
    </section>
  );
}

export default OrderConfirmation;
