import { useState, useEffect, useRef } from "react";
import { orderAPI } from "../services/api";
import "./QuotationManagement.css";

function QuotationManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    quotedPrice: "",
    adminNotes: "",
    deliveryTime: "",
  });
  const [updatingQuote, setUpdatingQuote] = useState(false);
  const [message, setMessage] = useState("");
  const dropdownRef = useRef(null);

  const downloadCSV = () => {
    // Prepare CSV data
    const csvRows = [];
    
    // Add headers
    const headers = [
      "Order Number",
      "Customer Name",
      "Email",
      "Phone",
      "Company",
      "Products",
      "Delivery Address",
      "Status",
      "Special Requirements",
      "Order Date"
    ];
    csvRows.push(headers.join(","));

    // Add data rows
    filteredOrders.forEach(order => {
      const products = order.products
        ?.map(p => `${p.name} (${p.quantity} ${p.unit})`)
        .join("; ") || "N/A";
      
      const address = order.deliveryAddress
        ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}, ${order.deliveryAddress.country} ${order.deliveryAddress.zipCode}`
        : "N/A";

      const row = [
        order.orderNumber || "N/A",
        `"${order.customerInfo?.name || "N/A"}"`,
        order.customerInfo?.email || "N/A",
        order.customerInfo?.phone || "N/A",
        `"${order.customerInfo?.company || "N/A"}"`,
        `"${products}"`,
        `"${address}"`,
        order.status || "N/A",
        `"${order.requirements?.replace(/"/g, '""') || "N/A"}"`,
        new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      ];
      csvRows.push(row.join(","));
    });

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `quotations_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMessage("✅ CSV file downloaded successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        _id: "ORD-000001",
        orderNumber: "ORD-000001",
        customerInfo: {
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "9876543210",
          company: "Tech Solutions Inc",
        },
        deliveryAddress: {
          street: "123 Main Street, Tech Park",
          city: "Silicon Valley",
          state: "CA",
          country: "USA",
          zipCode: "94000",
        },
        products: [
          {
            name: "Product A",
            quantity: 25,
            unit: "Units",
          },
          {
            name: "Product B",
            quantity: 15,
            unit: "Units",
          },
        ],
        status: "pending",
        createdAt: "2025-10-08T00:00:00.000Z",
        requirements: "Handle with care - fragile items",
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
      pending: { label: "PENDING", color: "#f59e0b", bgColor: "#fef3c7" },
      quoted: { label: "QUOTED", color: "#8b5cf6", bgColor: "#f3e8ff" },
      confirmed: { label: "CONFIRMED", color: "#10b981", bgColor: "#d1fae5" },
      processing: { label: "PROCESSING", color: "#06b6d4", bgColor: "#cffafe" },
      shipped: { label: "SHIPPED", color: "#6366f1", bgColor: "#e0e7ff" },
      delivered: { label: "DELIVERED", color: "#059669", bgColor: "#d1fae5" },
      cancelled: { label: "CANCELLED", color: "#ef4444", bgColor: "#fee2e2" },
    };

    const config = statusConfig[status] || { label: status.toUpperCase(), color: "#6b7280", bgColor: "#f3f4f6" };

    return (
      <span
        className="status-badge"
        style={{ backgroundColor: config.bgColor, color: config.color }}
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

        <div className="cust-filter-dropdown" ref={dropdownRef}>
          <div
            className="cust-dropdown-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="cust-dropdown-label">
              {filterStatus === "all" && "All Orders"}
              {filterStatus === "pending" && "Pending"}
              {filterStatus === "quoted" && "Quoted"}
              {filterStatus === "confirmed" && "Confirmed"}
            </span>
            <svg
              className={`cust-dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M6 9L1 4h10z" />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div
                className={`dropdown-item ${filterStatus === "all" ? "active" : ""}`}
                onClick={() => {
                  setFilterStatus("all");
                  setIsDropdownOpen(false);
                }}
              >
                All Orders
              </div>
              <div
                className={`dropdown-item ${filterStatus === "pending" ? "active" : ""}`}
                onClick={() => {
                  setFilterStatus("pending");
                  setIsDropdownOpen(false);
                }}
              >
                Pending
              </div>
              <div
                className={`dropdown-item ${filterStatus === "quoted" ? "active" : ""}`}
                onClick={() => {
                  setFilterStatus("quoted");
                  setIsDropdownOpen(false);
                }}
              >
                Quoted
              </div>
              <div
                className={`dropdown-item ${filterStatus === "confirmed" ? "active" : ""}`}
                onClick={() => {
                  setFilterStatus("confirmed");
                  setIsDropdownOpen(false);
                }}
              >
                Confirmed
              </div>
            </div>
          )}
        </div>

        <button className="download-btn" onClick={downloadCSV}>
          📥 Download Data
        </button>

        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
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
                  <h3>{order.orderNumber}</h3>
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
                  <h4><span className="section-icon">👤</span> Customer Information</h4>
                  <div className="customer-details">
                    <div className="cust-detail-item">
                      <span className="cust-detail-icon">👤</span>
                      <span className="cust-detail-value">
                        {order.customerInfo?.name}
                      </span>
                    </div>
                    <div className="cust-detail-item">
                      <span className="cust-detail-icon">✉️</span>
                      <span className="cust-detail-value">
                        {order.customerInfo?.email}
                      </span>
                    </div>
                    <div className="cust-detail-item">
                      <span className="cust-detail-icon">📞</span>
                      <span className="cust-detail-value">
                        {order.customerInfo?.phone}
                      </span>
                    </div>
                    {order.customerInfo?.company && (
                      <div className="cust-detail-item">
                        <span className="cust-detail-icon">🏢</span>
                        <span className="cust-detail-value">
                          {order.customerInfo.company}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="products-section">
                  <h4><span className="section-icon">📦</span> Requested Products</h4>
                  <div className="cust-products-list">
                    {order.products?.map((product, index) => (
                      <div key={index} className="cust-product-item">
                        <span className="product-name">{product.name}</span>
                        <span className="product-quantity">
                          {product.quantity} {product.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="delivery-section">
                    <h4><span className="section-icon">📍</span> Delivery Address</h4>
                    <p className="address-text">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state}, {order.deliveryAddress.country}{" "}
                      {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                )}

                {order.requirements && (
                  <div className="requirements-section">
                    <h4><span className="section-icon">📝</span> Special Requirements</h4>
                    <p className="requirements-text">{order.requirements}</p>
                  </div>
                )}
              </div>

              <div className="quotation-card-footer">
                <button
                  className="btn-send-quote"
                  onClick={() => openQuoteModal(order)}
                >
                  {order.status === "quoted"
                    ? "Update Quotation"
                    : "Update Quotation"}
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
