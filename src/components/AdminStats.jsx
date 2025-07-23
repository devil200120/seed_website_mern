import React from 'react';

const AdminStats = ({ stats, recentOrders, loading, onRefresh }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      reviewed: '#2196f3',
      quoted: '#9c27b0',
      confirmed: '#4caf50',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="admin-stats">
      <div className="stats-header">
        <h2>Overview</h2>
        <button className="btn btn-secondary" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card confirmed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.confirmedOrders}</h3>
            <p>Confirmed Orders</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{stats.completedOrders}</h3>
            <p>Completed Orders</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalValue || 0)}</h3>
            <p>Total Order Value</p>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <p>No recent orders found</p>
          </div>
        ) : (
          <div className="orders-list">
            {recentOrders.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-info">
                  <strong>#{order.orderNumber}</strong>
                  <span className="customer-name">{order.customerInfo?.name}</span>
                </div>
                <div className="order-meta">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                  {order.totalEstimatedValue && (
                    <span className="order-value">
                      {formatCurrency(order.totalEstimatedValue)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStats;