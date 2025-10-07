import { useState, useEffect } from "react";
import { orderAPI } from "../services/api";
import "./QuotationManagement.css";

function QuotationManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    quotedPrice: "",
    adminNotes: "",
    deliveryTime: "",
  });
  const [updatingQuote, setUpdatingQuote] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders({
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: searchTerm || undefined,
      });

      if (response.data.success) {
        setOrders(response.data.data.orders);
      } else {
        setOrders(getMockOrders());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  const getMockOrders = () => {
    return [
      {
        _id: "ORD-001",
        orderNumber: "ORD-001",
        customerInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 234 567 8900",
          company: "ABC Trading Co.",
        },
        deliveryAddress: {
          street: "123 Business St",
          city: "New York",
          state: "NY",
          country: "USA",
          zipCode: "10001",
        },
        products: [
          {
            name: "Premium Basmati Rice",
            quantity: 10,
            unit: "MT",
            estimatedPrice: 1000,
          },
          {
            name: "Fresh Onions",
            quantity: 5,
            unit: "MT",
            estimatedPrice: 300,
          },
        ],
        estimatedTotal: 13000,
        status: "pending",
        createdAt: new Date().toISOString(),
        requirements: "Please ensure organic certification for the rice.",
      },
    ];
  };

  const openQuoteModal = (order) => {
    setSelectedOrder(order);
    setQuoteData({
      quotedPrice: order.quotedPrice || order.estimatedTotal || "",
      adminNotes: order.adminNotes || "",
      deliveryTime: order.deliveryTime || "",
    });
    setShowQuoteModal(true);
  };

  const closeQuoteModal = () => {
    setSelectedOrder(null);
    setShowQuoteModal(false);
    setQuoteData({
      quotedPrice: "",
      adminNotes: "",
      deliveryTime: "",
    });
  };

  const handleQuoteSubmit = async () => {
    if (!selectedOrder || !quoteData.quotedPrice) {
      setMessage("❌ Please enter a quoted price");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setUpdatingQuote(true);
      setMessage("");

      const response = await orderAPI.provideQuote(selectedOrder._id, {
        quotedPrice: parseFloat(quoteData.quotedPrice),
        adminNotes: quoteData.adminNotes,
        deliveryTime: quoteData.deliveryTime,
      });

      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, ...response.data.data.order, status: "quoted" }
              : order
          )
        );

        setMessage("✅ Quotation sent successfully to the customer!");
        closeQuoteModal();
        setTimeout(() => setMessage(""), 5000);
      } else {
        throw new Error(response.data.message || "Failed to send quotation");
      }
    } catch (error) {
      console.error("Error sending quotation:", error);
      setMessage(`❌ Failed to send quotation: ${error.message}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setUpdatingQuote(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.company?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "#f59e0b" },
      quoted: { label: "Quoted", color: "#8b5cf6" },
      confirmed: { label: "Confirmed", color: "#10b981" },
      processing: { label: "Processing", color: "#06b6d4" },
      shipped: { label: "Shipped", color: "#6366f1" },
      delivered: { label: "Delivered", color: "#059669" },
      cancelled: { label: "Cancelled", color: "#ef4444" },
    };

    const config = statusConfig[status] || { label: status, color: "#6b7280" };

    return (
      <span
        className="status-badge"
        style={{ backgroundColor: config.color + "20", color: config.color }}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="quotation-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quotation requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quotation-management">
      <div className="quotation-header">
        <div className="header-content">
          <h2>Quotation Management</h2>
          <p>Review order requests and send quotations to buyers</p>
        </div>
        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("✅") ? "alert-success" : "alert-error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Filters and Search */}
      <div className="quotation-filters">
        <div className="search-box">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order number, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All Orders
          </button>
          <button
            className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filterStatus === "quoted" ? "active" : ""}`}
            onClick={() => setFilterStatus("quoted")}
          >
            Quoted
          </button>
          <button
            className={`filter-btn ${filterStatus === "confirmed" ? "active" : ""}`}
            onClick={() => setFilterStatus("confirmed")}
          >
            Confirmed
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="quotation-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Orders Found</h3>
            <p>
              {searchTerm
                ? "No orders match your search criteria"
                : "No quotation requests available at the moment"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="quotation-card">
              <div className="quotation-card-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="order-status">{getStatusBadge(order.status)}</div>
              </div>

              <div className="quotation-card-body">
                <div className="customer-section">
                  <h4>Customer Information</h4>
                  <div className="customer-details">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">
                        {order.customerInfo?.name}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">
                        {order.customerInfo?.email}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">
                        {order.customerInfo?.phone}
                      </span>
                    </div>
                    {order.customerInfo?.company && (
                      <div className="detail-item">
                        <span className="detail-label">Company:</span>
                        <span className="detail-value">
                          {order.customerInfo.company}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="products-section">
                  <h4>Requested Products</h4>
                  <div className="products-list">
                    {order.products?.map((product, index) => (
                      <div key={index} className="product-item">
                        <span className="product-name">{product.name}</span>
                        <span className="product-quantity">
                          {product.quantity} {product.unit}
                        </span>
                        {product.estimatedPrice && (
                          <span className="product-price">
                            ${product.estimatedPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="delivery-section">
                    <h4>Delivery Address</h4>
                    <p className="address-text">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state}, {order.deliveryAddress.country}{" "}
                      {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                )}

                {order.requirements && (
                  <div className="requirements-section">
                    <h4>Special Requirements</h4>
                    <p className="requirements-text">{order.requirements}</p>
                  </div>
                )}

                <div className="pricing-section">
                  <div className="price-row">
                    <span className="price-label">Estimated Total:</span>
                    <span className="price-value">
                      ${order.estimatedTotal?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                  {order.quotedPrice && (
                    <div className="price-row">
                      <span className="price-label">Quoted Price:</span>
                      <span className="price-value quoted">
                        ${order.quotedPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="quotation-card-footer">
                <button
                  className="btn-send-quote"
                  onClick={() => openQuoteModal(order)}
                >
                  {order.status === "quoted"
                    ? "📝 Update Quotation"
                    : "📤 Send Quotation"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quote Modal */}
      {showQuoteModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeQuoteModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Quotation - Order #{selectedOrder.orderNumber}</h3>
              <button className="modal-close" onClick={closeQuoteModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="quote-summary">
                <h4>Order Summary</h4>
                <div className="summary-details">
                  <div className="summary-item">
                    <span>Customer:</span>
                    <strong>{selectedOrder.customerInfo?.name}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Total Items:</span>
                    <strong>{selectedOrder.products?.length || 0}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Estimated Total:</span>
                    <strong>
                      ${selectedOrder.estimatedTotal?.toLocaleString() || "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="quote-form">
                <div className="form-group">
                  <label>Quoted Price (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter final quoted price"
                    value={quoteData.quotedPrice}
                    onChange={(e) =>
                      setQuoteData({ ...quoteData, quotedPrice: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Time</label>
                  <input
                    type="text"
                    placeholder="e.g., 7-10 business days"
                    value={quoteData.deliveryTime}
                    onChange={(e) =>
                      setQuoteData({ ...quoteData, deliveryTime: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Notes for Customer</label>
                  <textarea
                    rows="4"
                    placeholder="Add any additional information, terms, or conditions..."
                    value={quoteData.adminNotes}
                    onChange={(e) =>
                      setQuoteData({ ...quoteData, adminNotes: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeQuoteModal}>
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleQuoteSubmit}
                disabled={updatingQuote || !quoteData.quotedPrice}
              >
                {updatingQuote ? "Sending..." : "Send Quotation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotationManagement;
