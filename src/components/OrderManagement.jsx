import React, { useState, useEffect } from "react";
import ApiService from "../service/api";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    loadOrders();
  }, [filterStatus, pagination.current]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: 10,
        ...(filterStatus && { status: filterStatus }),
      };

      const response = await ApiService.getOrders(params);
      if (response.success) {
        setOrders(response.orders || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, priority = null) => {
    try {
      const updateData = { status };
      if (priority) updateData.priority = priority;

      const response = await ApiService.updateOrderStatus(orderId, updateData);
      if (response.success) {
        loadOrders(); // Refresh the list
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ff9800",
      reviewed: "#2196f3",
      quoted: "#9c27b0",
      confirmed: "#4caf50",
      processing: "#2196f3",
      shipped: "#9c27b0",
      delivered: "#4caf50",
      cancelled: "#f44336",
    };
    return colors[status] || "#666";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="order-management">
      <div className="management-header">
        <h2>Order Management</h2>

        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="quoted">Quoted</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="btn btn-secondary" onClick={loadOrders}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <>
          <div className="orders-table">
            <div className="table-header">
              <div className="col">Order #</div>
              <div className="col">Customer</div>
              <div className="col">Products</div>
              <div className="col">Value</div>
              <div className="col">Status</div>
              <div className="col">Date</div>
              <div className="col">Actions</div>
            </div>

            {orders.map((order) => (
              <div key={order._id} className="table-row">
                <div className="col">
                  <strong>#{order.orderNumber}</strong>
                </div>

                <div className="col">
                  <div className="customer-info">
                    <strong>{order.customerInfo?.name}</strong>
                    <small>{order.customerInfo?.email}</small>
                  </div>
                </div>

                <div className="col">
                  <div className="products-summary">
                    {order.products?.slice(0, 2).map((product, index) => (
                      <span key={index} className="product-tag">
                        {product.productName}
                      </span>
                    ))}
                    {order.products?.length > 2 && (
                      <span className="more-products">
                        +{order.products.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="col">
                  {order.totalEstimatedValue
                    ? formatCurrency(order.totalEstimatedValue)
                    : "N/A"}
                </div>

                <div className="col">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="col">
                  <small>{formatDate(order.createdAt)}</small>
                </div>

                <div className="col">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.current === 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    current: prev.current - 1,
                  }))
                }
              >
                Previous
              </button>

              <span>
                Page {pagination.current} of {pagination.pages}(
                {pagination.total} total)
              </span>

              <button
                disabled={pagination.current === pagination.pages}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    current: prev.current + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.orderNumber}</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="order-details-grid">
                <div className="details-section">
                  <h4>Customer Information</h4>
                  <p>
                    <strong>Name:</strong> {selectedOrder.customerInfo?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customerInfo?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customerInfo?.phone}
                  </p>
                  {selectedOrder.customerInfo?.company && (
                    <p>
                      <strong>Company:</strong>{" "}
                      {selectedOrder.customerInfo.company}
                    </p>
                  )}
                  {selectedOrder.customerInfo?.country && (
                    <p>
                      <strong>Country:</strong>{" "}
                      {selectedOrder.customerInfo.country}
                    </p>
                  )}
                </div>

                <div className="details-section">
                  <h4>Products</h4>
                  {selectedOrder.products?.map((product, index) => (
                    <div key={index} className="product-detail">
                      <strong>{product.productName}</strong> ({product.category}
                      )
                      <br />
                      <small>
                        Quantity: {product.quantity} {product.unit}
                        {product.specifications && (
                          <span> - {product.specifications}</span>
                        )}
                      </small>
                    </div>
                  ))}
                </div>

                <div className="details-section">
                  <h4>Order Information</h4>
                  <p>
                    <strong>Timeline:</strong> {selectedOrder.timeline}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className="status-badge ml-2"
                      style={{
                        backgroundColor: getStatusColor(selectedOrder.status),
                      }}
                    >
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </p>
                  {selectedOrder.totalEstimatedValue && (
                    <p>
                      <strong>Estimated Value:</strong>{" "}
                      {formatCurrency(selectedOrder.totalEstimatedValue)}
                    </p>
                  )}
                  <p>
                    <strong>Created:</strong>{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <div className="details-section full-width">
                  <h4>Message</h4>
                  <p>{selectedOrder.message}</p>

                  {selectedOrder.specialRequirements && (
                    <>
                      <h4>Special Requirements</h4>
                      <p>{selectedOrder.specialRequirements}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <div className="status-actions">
                <h4>Update Status:</h4>
                <div className="status-buttons">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, "reviewed")
                    }
                  >
                    Mark as Reviewed
                  </button>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, "quoted")
                    }
                  >
                    Mark as Quoted
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, "confirmed")
                    }
                  >
                    Confirm Order
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, "processing")
                    }
                  >
                    Start Processing
                  </button>
                  <button
                    className="btn btn-sm btn-purple"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, "shipped")
                    }
                  >
                    Mark as Shipped
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, "delivered")
                    }
                  >
                    Mark as Delivered
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, "cancelled")
                    }
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
