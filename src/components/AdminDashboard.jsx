import { useState, useEffect } from "react";
import { orderAPI, authUtils } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get admin info from localStorage
  const { admin } = authUtils.getAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch order statistics and recent orders
      const response = await orderAPI.getOrderStats();

      if (response.data.success) {
        const { stats: orderStats, recentOrders: orders } = response.data.data;

        // Update stats
        setStats({
          totalOrders: orderStats.totalOrders || 0,
          totalRevenue: calculateTotalRevenue(orders),
          pendingOrders: orderStats.pendingOrders || 0,
          completedOrders: orderStats.completedOrders || 0,
        });

        // Update recent activity based on recent orders
        setRecentOrders(orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = (orders) => {
    return orders.reduce((total, order) => {
      return total + (order.quotedPrice || order.totalEstimatedValue || 0);
    }, 0);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      reviewed: "👁️",
      quoted: "💰",
      confirmed: "✅",
      processing: "⚙️",
      shipped: "🚚",
      delivered: "📦",
      cancelled: "❌",
    };
    return icons[status] || "📋";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      reviewed: "info",
      quoted: "primary",
      confirmed: "success",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "danger",
    };
    return colors[status] || "secondary";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard error">
        <div className="error-message">
          <h3>⚠️ Error Loading Dashboard</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {admin?.name || "Admin"}! 👋</h1>
          <p>Here's what's happening with your business today.</p>
        </div>
        <div className="adm-quick-actions">
          <button onClick={handleRefresh} className="adm-quick-action-btn primary">
            <span>�</span>
            Refresh Data
          </button>
          <button className="adm-quick-action-btn secondary">
            <span>�</span>
            View All Orders
          </button>
          <button className="adm-quick-action-btn tertiary">
            <span>�</span>
            Analytics
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="adm-stats-grid">
        <div className="adm-stat-card orders">
          <div className="adm-stat-icon">📊</div>
          <div className="adm-stat-content">
            <div className="adm-stat-number">
              {stats.totalOrders.toLocaleString()}
            </div>
            <div className="adm-stat-label">Total Orders</div>
            <div className="adm-stat-change positive">+12% from last month</div>
          </div>
        </div>

        <div className="adm-stat-card completed">
          <div className="adm-stat-icon">✅</div>
          <div className="adm-stat-content">
            <div className="adm-stat-number">{stats.completedOrders}</div>
            <div className="adm-stat-label">Completed Orders</div>
            <div className="adm-stat-change positive">Orders delivered</div>
          </div>
        </div>

        <div className="adm-stat-card pending">
          <div className="adm-stat-icon">⏳</div>
          <div className="adm-stat-content">
            <div className="adm-stat-number">{stats.pendingOrders}</div>
            <div className="adm-stat-label">Pending Orders</div>
            <div className="adm-stat-change neutral">Needs attention</div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics Section */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-card activity-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="view-all-btn">View All Orders</button>
          </div>
          <div className="activity-list">
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="activity-item">
                  <div className="activity-icon">
                    {getStatusIcon(order.status)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">
                      Order #{order.orderNumber} from {order.customerInfo.name}
                    </div>
                    <div className="activity-time">
                      {formatTimeAgo(order.createdAt)} • {order.status}
                    </div>
                  </div>
                  <div
                    className={`status-badge ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="dashboard-card products-card">
          <div className="card-header">
            <h3>Order Status Summary</h3>
            <button className="view-all-btn">View Details</button>
          </div>
          <div className="products-list">
            <div className="product-item">
              <div className="product-rank">⏳</div>
              <div className="product-info">
                <div className="product-name">Pending Orders</div>
                <div className="product-stats">
                  {stats.pendingOrders} orders awaiting review
                </div>
              </div>
              <div className="product-trend warning">Needs Action</div>
            </div>
            <div className="product-item">
              <div className="product-rank">✅</div>
              <div className="product-info">
                <div className="product-name">Completed Orders</div>
                <div className="product-stats">
                  {stats.completedOrders} orders delivered
                </div>
              </div>
              <div className="product-trend positive">Success</div>
            </div>
            <div className="product-item">
              <div className="product-rank">💰</div>
              <div className="product-info">
                <div className="product-name">Total Revenue</div>
                <div className="product-stats">
                  {formatCurrency(stats.totalRevenue)} estimated value
                </div>
              </div>
              <div className="product-trend positive">Revenue</div>
            </div>
          </div>
        </div>

        {/* Business Overview */}
        <div className="dashboard-card quick-stats-card">
          <div className="card-header">
            <h3>Business Overview</h3>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-icon">�</div>
              <div className="quick-stat-content">
                <div className="quick-stat-number">{stats.totalOrders}</div>
                <div className="quick-stat-label">Total Orders</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">💰</div>
              <div className="quick-stat-content">
                <div className="quick-stat-number">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="quick-stat-label">Revenue</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">⏳</div>
              <div className="quick-stat-content">
                <div className="quick-stat-number">{stats.pendingOrders}</div>
                <div className="quick-stat-label">Pending</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon">✅</div>
              <div className="quick-stat-content">
                <div className="quick-stat-number">{stats.completedOrders}</div>
                <div className="quick-stat-label">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
