import { useState, useEffect } from "react";
import { orderAPI } from "../services/api";
import Invoice from "./Invoice";
import "./AllOrders.css";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const ordersPerPage = 10;

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getAllOrders({
          page: currentPage,
          limit: ordersPerPage,
          status: filterStatus !== "all" ? filterStatus : undefined,
          search: searchTerm || undefined,
        });

        if (response.data.success) {
          setOrders(response.data.data.orders);
        } else {
          console.error("Failed to fetch orders:", response.data.message);
          // Fallback to mock data if API fails
          setOrders(getMockOrders());
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Fallback to mock data if API fails
        setOrders(getMockOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, filterStatus, searchTerm]);

  // Mock data fallback function
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
        products: [
          { name: "Premium Basmati Rice", quantity: 10, unit: "MT" },
          { name: "Fresh Onions", quantity: 5, unit: "MT" },
        ],
        totalItems: 2,
        status: "pending",
        createdAt: "2024-12-20",
        requirements: "Please ensure organic certification for the rice.",
      },
      {
        _id: "ORD-002",
        orderNumber: "ORD-002",
        customerInfo: {
          name: "Sarah Wilson",
          email: "sarah@foodmart.com",
          phone: "+1 234 567 8901",
          company: "FoodMart Industries",
        },
        products: [{ name: "Turmeric Powder", quantity: 100, unit: "KG" }],
        totalItems: 1,
        status: "confirmed",
        createdAt: "2024-12-19",
        requirements: "Need delivery by end of month.",
      },
      {
        _id: "ORD-003",
        orderNumber: "ORD-003",
        customerInfo: {
          name: "Michael Chen",
          email: "mike@globalfood.com",
          phone: "+1 234 567 8902",
          company: "Global Food Solutions",
        },
        products: [
          { name: "Alphonso Mangoes", quantity: 500, unit: "KG" },
          { name: "Chickpeas", quantity: 2, unit: "MT" },
          { name: "Sesame Seeds", quantity: 1, unit: "MT" },
        ],
        totalItems: 3,
        status: "processing",
        createdAt: "2024-12-18",
        requirements: "Bulk order for international export.",
      },
      {
        _id: "ORD-004",
        orderNumber: "ORD-004",
        customerInfo: {
          name: "Emma Rodriguez",
          email: "emma@organicfoods.com",
          phone: "+1 234 567 8903",
          company: "Organic Foods Ltd.",
        },
        products: [{ name: "Fresh Onions", quantity: 20, unit: "MT" }],
        totalItems: 1,
        status: "delivered",
        createdAt: "2024-12-17",
        requirements:
          "Satisfied with previous orders, looking for long-term partnership.",
      },
      {
        _id: "ORD-005",
        orderNumber: "ORD-005",
        customerInfo: {
          name: "David Kumar",
          email: "david@spiceworld.com",
          phone: "+1 234 567 8904",
          company: "Spice World International",
        },
        products: [
          { name: "Turmeric Powder", quantity: 250, unit: "KG" },
          { name: "Premium Basmati Rice", quantity: 25, unit: "MT" },
        ],
        totalItems: 2,
        status: "cancelled",
        createdAt: "2024-12-16",
        requirements:
          "Changed requirements, may reorder with different specifications.",
      },
    ];
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerInfo.company &&
        order.customerInfo.company
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    quotedPrice: "",
    adminNotes: "",
    deliveryTime: "",
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  const handleProvideQuote = (order) => {
    setSelectedOrder(order);
    setQuoteData({
      quotedPrice: order.quotedPrice || "",
      adminNotes: order.adminNotes || "",
      deliveryTime: order.expectedDelivery
        ? order.expectedDelivery.split("T")[0]
        : "",
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
    if (!selectedOrder || !quoteData.quotedPrice) return;

    try {
      setUpdatingStatus(selectedOrder._id);
      setUpdateMessage("");

      const response = await orderAPI.provideQuote(selectedOrder._id, {
        quotedPrice: parseFloat(quoteData.quotedPrice),
        adminNotes: quoteData.adminNotes,
        deliveryTime: quoteData.deliveryTime,
      });

      if (response.data.success) {
        // Update local orders list
        setOrders(
          orders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, ...response.data.data.order }
              : order
          )
        );

        setUpdateMessage(
          "✅ Quote provided successfully! Customer has been notified."
        );
        closeQuoteModal();

        // Clear message after 3 seconds
        setTimeout(() => setUpdateMessage(""), 3000);
      } else {
        throw new Error(response.data.message || "Failed to provide quote");
      }
    } catch (error) {
      console.error("Error providing quote:", error);
      setUpdateMessage(`❌ Failed to provide quote: ${error.message}`);

      // Clear error message after 5 seconds
      setTimeout(() => setUpdateMessage(""), 5000);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      reviewed: "#3b82f6",
      quoted: "#8b5cf6",
      confirmed: "#10b981",
      processing: "#06b6d4",
      shipped: "#6366f1",
      delivered: "#059669",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "status-pending",
      reviewed: "status-reviewed",
      quoted: "status-quoted",
      confirmed: "status-confirmed",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };

    return (
      <span className={`status-badge ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    // Don't show confirmation for same status
    if (newStatus === currentStatus) return;

    // Set pending update and show confirmation
    setPendingUpdate({ orderId, newStatus, currentStatus });
    setShowConfirmDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingUpdate) return;

    const { orderId, newStatus } = pendingUpdate;

    try {
      setUpdatingStatus(orderId);
      setUpdateMessage("");

      const response = await orderAPI.updateOrderStatus(orderId, {
        status: newStatus,
      });

      if (response.data.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : order
          )
        );

        setUpdateMessage(
          `✅ Order status updated to ${newStatus} successfully!`
        );

        // Clear message after 3 seconds
        setTimeout(() => setUpdateMessage(""), 3000);
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setUpdateMessage(`❌ Failed to update status: ${error.message}`);

      // Clear error message after 5 seconds
      setTimeout(() => setUpdateMessage(""), 5000);
    } finally {
      setUpdatingStatus(null);
      setShowConfirmDialog(false);
      setPendingUpdate(null);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmDialog(false);
    setPendingUpdate(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="all-orders">
      {/* Orders Header */}
      <div className="orders-header">
        <h1>Order Management 📋</h1>
        <p>Monitor and manage all customer orders efficiently.</p>
      </div>

      {/* Update Message */}
      {updateMessage && (
        <div
          className={`update-message ${
            updateMessage.includes("✅") ? "success" : "error"
          }`}
        >
          {updateMessage}
        </div>
      )}

      {/* Header with stats */}
      <div className="orders-stats">
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter((o) => o.status === "pending").length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter((o) => o.status === "processing").length}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter((o) => o.status === "delivered").length}</h3>
          <p>Delivered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search orders by customer, email, order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="quoted">Quoted</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Products</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id}>
                <td className="order-id">{order.orderNumber}</td>
                <td>
                  <div className="customer-info">
                    <strong>{order.customerInfo.name}</strong>
                    <small>{order.customerInfo.company}</small>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>{order.customerInfo.email}</div>
                    <div>{order.customerInfo.phone}</div>
                  </div>
                </td>
                <td>
                  <div className="products-info">
                    <strong>{order.totalItems} item(s)</strong>
                    <div className="products-list">
                      {order.products.map((product, index) => (
                        <div key={index} className="product-item">
                          {product.name}: {product.quantity} {product.unit}
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      title="View Details"
                      onClick={() => handleViewOrder(order)}
                    >
                      👁️ View
                    </button>
                    {["pending", "reviewed"].includes(order.status) && (
                      <button
                        className="btn-quote"
                        title="Provide Quote"
                        onClick={() => handleProvideQuote(order)}
                        disabled={updatingStatus === order._id}
                      >
                        💰 Quote
                      </button>
                    )}
                    <button
                      className="btn-invoice"
                      title="Generate Invoice"
                      onClick={() => {
                        setSelectedOrderForInvoice(order);
                        setShowInvoice(true);
                      }}
                    >
                      📄 Invoice
                    </button>
                    <select
                      className={`status-update ${
                        updatingStatus === order._id ? "updating" : ""
                      }`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value,
                          order.status
                        )
                      }
                      disabled={updatingStatus === order._id}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="quoted">Quoted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingStatus === order._id && (
                      <div className="updating-spinner">⏳</div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Status Change Confirmation Dialog */}
      {showConfirmDialog && pendingUpdate && (
        <div className="modal-overlay">
          <div className="confirmation-dialog">
            <div className="dialog-header">
              <h3>Confirm Status Change</h3>
            </div>
            <div className="dialog-content">
              <p>
                Are you sure you want to change the status from
                <strong> {pendingUpdate.currentStatus} </strong>
                to <strong> {pendingUpdate.newStatus}</strong>?
              </p>
              {pendingUpdate.newStatus === "confirmed" && (
                <div className="warning-note">
                  ⚠️ This will trigger an admin notification email.
                </div>
              )}
            </div>
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={cancelStatusChange}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmStatusChange}>
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-details-modal">
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.orderNumber}</h3>
              <button className="close-btn" onClick={closeOrderDetails}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="order-info-grid">
                <div className="info-section">
                  <h4>Customer Information</h4>
                  <p>
                    <strong>Name:</strong> {selectedOrder.customerInfo.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customerInfo.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customerInfo.phone}
                  </p>
                  {selectedOrder.customerInfo.company && (
                    <p>
                      <strong>Company:</strong>{" "}
                      {selectedOrder.customerInfo.company}
                    </p>
                  )}
                </div>

                <div className="info-section">
                  <h4>Order Information</h4>
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total Items:</strong> {selectedOrder.totalItems}
                  </p>
                  {selectedOrder.quotedPrice && (
                    <p>
                      <strong>Quoted Price:</strong> $
                      {selectedOrder.quotedPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="info-section">
                <h4>Products Ordered</h4>
                <div className="products-detail-list">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="product-detail-item">
                      <span className="product-name">{product.name}</span>
                      <span className="product-quantity">
                        {product.quantity} {product.unit}
                      </span>
                      <span className="product-category">
                        {product.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.requirements && (
                <div className="info-section">
                  <h4>Special Requirements</h4>
                  <p className="requirements-text">
                    {selectedOrder.requirements}
                  </p>
                </div>
              )}

              {selectedOrder.adminNotes && (
                <div className="info-section">
                  <h4>Admin Notes</h4>
                  <p className="admin-notes">{selectedOrder.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="quote-modal">
            <div className="modal-header">
              <h3>Provide Quote - {selectedOrder.orderNumber}</h3>
              <button className="close-btn" onClick={closeQuoteModal}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="quote-form">
                <div className="form-group">
                  <label htmlFor="quotedPrice">Quoted Price (USD) *</label>
                  <input
                    type="number"
                    id="quotedPrice"
                    step="0.01"
                    min="0"
                    value={quoteData.quotedPrice}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        quotedPrice: e.target.value,
                      })
                    }
                    placeholder="Enter quote amount"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryTime">Expected Delivery Date</label>
                  <input
                    type="date"
                    id="deliveryTime"
                    value={quoteData.deliveryTime}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        deliveryTime: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adminNotes">Additional Notes</label>
                  <textarea
                    id="adminNotes"
                    rows="4"
                    value={quoteData.adminNotes}
                    onChange={(e) =>
                      setQuoteData({ ...quoteData, adminNotes: e.target.value })
                    }
                    placeholder="Add any special notes, terms, or conditions for this quote..."
                  ></textarea>
                </div>

                <div className="customer-info-summary">
                  <h4>Customer: {selectedOrder.customerInfo.name}</h4>
                  <p>Email: {selectedOrder.customerInfo.email}</p>
                  <p>Products: {selectedOrder.totalItems} items</p>
                </div>

                <div className="quote-actions">
                  <button
                    className="btn-cancel"
                    onClick={closeQuoteModal}
                    disabled={updatingStatus === selectedOrder._id}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-submit-quote"
                    onClick={handleQuoteSubmit}
                    disabled={
                      !quoteData.quotedPrice ||
                      updatingStatus === selectedOrder._id
                    }
                  >
                    {updatingStatus === selectedOrder._id
                      ? "Sending..."
                      : "Send Quote"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="quote-modal">
            <div className="modal-header">
              <h3>Provide Quote - {selectedOrder.orderNumber}</h3>
              <button className="close-btn" onClick={closeQuoteModal}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="customer-info-summary">
                <h4>Customer Information</h4>
                <p>
                  <strong>Name:</strong> {selectedOrder.customerInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.customerInfo.email}
                </p>
                <p>
                  <strong>Company:</strong>{" "}
                  {selectedOrder.customerInfo.company || "N/A"}
                </p>
                <p>
                  <strong>Products:</strong> {selectedOrder.totalItems} items
                </p>
              </div>

              <div className="quote-form">
                <div className="form-group">
                  <label htmlFor="quotedPrice">Quoted Price (USD) *</label>
                  <input
                    type="number"
                    id="quotedPrice"
                    value={quoteData.quotedPrice}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        quotedPrice: e.target.value,
                      })
                    }
                    placeholder="Enter quoted price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryTime">Expected Delivery Date</label>
                  <input
                    type="date"
                    id="deliveryTime"
                    value={quoteData.deliveryTime}
                    onChange={(e) =>
                      setQuoteData({
                        ...quoteData,
                        deliveryTime: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adminNotes">Terms & Conditions / Notes</label>
                  <textarea
                    id="adminNotes"
                    value={quoteData.adminNotes}
                    onChange={(e) =>
                      setQuoteData({ ...quoteData, adminNotes: e.target.value })
                    }
                    placeholder="Enter any terms, conditions, or additional notes for the customer..."
                    rows="4"
                  />
                </div>

                <div className="quote-actions">
                  <button
                    className="btn-cancel"
                    onClick={closeQuoteModal}
                    disabled={updatingStatus === selectedOrder._id}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-submit-quote"
                    onClick={handleQuoteSubmit}
                    disabled={
                      !quoteData.quotedPrice ||
                      updatingStatus === selectedOrder._id
                    }
                  >
                    {updatingStatus === selectedOrder._id
                      ? "Sending..."
                      : "Send Quote"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selectedOrderForInvoice && (
        <Invoice
          order={selectedOrderForInvoice}
          onClose={() => {
            setShowInvoice(false);
            setSelectedOrderForInvoice(null);
          }}
        />
      )}
    </div>
  );
}

export default AllOrders;
