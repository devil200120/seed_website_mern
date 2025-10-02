import { useState, useEffect } from "react";
import { orderAPI } from "../services/api";

function AdminStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    ordersByStatus: {},
    monthlyData: {},
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderAPI.getOrderStats();

      if (response.data.success) {
        const { stats: orderStats, recentOrders } = response.data.data;

        const processedStats = {
          ...orderStats,
          totalRevenue: calculateTotalRevenue(recentOrders),
          ordersByStatus: calculateOrdersByStatus(recentOrders),
          monthlyData: calculateMonthlyData(recentOrders),
        };

        setStats(processedStats);
        setRecentOrders(recentOrders || []);
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = (orders) => {
    return orders.reduce((total, order) => {
      return total + (order.quotedPrice || order.totalEstimatedValue || 0);
    }, 0);
  };

  const calculateOrdersByStatus = (orders) => {
    const statusCount = {};
    orders.forEach((order) => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    return statusCount;
  };

  const calculateMonthlyData = (orders) => {
    const monthlyOrders = {};
    const monthlyRevenue = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString("en-US", { month: "short" });
      monthlyOrders[monthKey] = 0;
      monthlyRevenue[monthKey] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthKey = orderDate.toLocaleDateString("en-US", {
        month: "short",
      });

      if (monthlyOrders.hasOwnProperty(monthKey)) {
        monthlyOrders[monthKey]++;
        monthlyRevenue[monthKey] +=
          order.quotedPrice || order.totalEstimatedValue || 0;
      }
    });

    return { orders: monthlyOrders, revenue: monthlyRevenue };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getConversionRate = () => {
    if (stats.totalOrders === 0) return "0";
    return ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="admin-stats loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-stats error">
        <div className="error-message">
          <h3>⚠️ Error Loading Analytics</h3>
          <p>{error}</p>
          <button onClick={fetchAnalyticsData} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-stats">
      <div className="analytics-header">
        <div className="header-left">
          <h1>📊 Analytics & Insights</h1>
          <p>Real-time insights and visual analytics from your business data</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchAnalyticsData} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div className="kpi-summary">
        <div className="kpi-card">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <h4>Total Orders</h4>
            <div className="kpi-number">{stats.totalOrders}</div>
            <div className="kpi-subtitle">All time orders</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h4>Total Revenue</h4>
            <div className="kpi-number">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="kpi-subtitle">Quoted value</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">⏳</div>
          <div className="kpi-content">
            <h4>Pending Orders</h4>
            <div className="kpi-number">{stats.pendingOrders}</div>
            <div className="kpi-subtitle">Awaiting action</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">✅</div>
          <div className="kpi-content">
            <h4>Completed</h4>
            <div className="kpi-number">{stats.completedOrders}</div>
            <div className="kpi-subtitle">Successfully delivered</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <h4>Success Rate</h4>
            <div className="kpi-number">{getConversionRate()}%</div>
            <div className="kpi-subtitle">Completion rate</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>📊 Order Status Distribution</h3>
            <p>Current breakdown of all orders by status</p>
          </div>
          <div className="chart-container">
            <div className="status-chart">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => {
                const maxCount = Math.max(
                  ...Object.values(stats.ordersByStatus)
                );
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                  <div key={status} className="status-bar-item">
                    <div className="status-info">
                      <span className="status-name">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span className="status-count">{count} orders</span>
                    </div>
                    <div className="status-bar">
                      <div
                        className={`status-fill ${status}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="status-percentage">
                      {stats.totalOrders
                        ? Math.round((count / stats.totalOrders) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Orders Trend (Last 6 Months)</h3>
            <p>Number of orders received each month</p>
          </div>
          <div className="chart-container">
            <div className="monthly-chart">
              {Object.entries(stats.monthlyData.orders || {}).map(
                ([month, orders]) => {
                  const maxOrders = Math.max(
                    ...Object.values(stats.monthlyData.orders || {})
                  );
                  const height = maxOrders > 0 ? (orders / maxOrders) * 100 : 0;

                  return (
                    <div key={month} className="month-bar">
                      <div
                        className="bar-fill"
                        style={{ height: `${height}%` }}
                        title={`${month}: ${orders} orders`}
                      ></div>
                      <span className="month-label">{month}</span>
                      <span className="month-value">{orders}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>💰 Revenue Overview</h3>
            <p>Monthly revenue breakdown</p>
          </div>
          <div className="chart-container">
            <div className="revenue-overview">
              {Object.entries(stats.monthlyData.revenue || {}).map(
                ([month, revenue]) => (
                  <div key={month} className="revenue-item">
                    <div className="revenue-month">{month}</div>
                    <div className="revenue-amount">
                      {formatCurrency(revenue)}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>🏆 Key Performance Indicators</h3>
            <p>Important business metrics</p>
          </div>
          <div className="chart-container">
            <div className="kpi-metrics">
              <div className="metric-box">
                <div className="metric-icon">💼</div>
                <div className="metric-info">
                  <div className="metric-label">Average Order Value</div>
                  <div className="metric-value">
                    {formatCurrency(
                      stats.totalOrders > 0
                        ? stats.totalRevenue / stats.totalOrders
                        : 0
                    )}
                  </div>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon">📈</div>
                <div className="metric-info">
                  <div className="metric-label">Completion Rate</div>
                  <div className="metric-value">{getConversionRate()}%</div>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon">👥</div>
                <div className="metric-info">
                  <div className="metric-label">Active Customers</div>
                  <div className="metric-value">
                    {
                      new Set(
                        recentOrders.map((order) => order.customerInfo.email)
                      ).size
                    }
                  </div>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon">📦</div>
                <div className="metric-info">
                  <div className="metric-label">Total Products</div>
                  <div className="metric-value">
                    {recentOrders.reduce(
                      (total, order) => total + order.totalItems,
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="card-header">
          <h3>📋 Recent Orders</h3>
          <p>Latest customer orders with detailed information</p>
        </div>
        <div className="orders-table">
          {recentOrders.slice(0, 8).map((order) => (
            <div key={order._id} className="order-row">
              <div className="order-info">
                <div className="order-number">#{order.orderNumber}</div>
                <div className="customer-name">{order.customerInfo.name}</div>
              </div>
              <div className="order-status">
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-value">
                {formatCurrency(
                  order.quotedPrice || order.totalEstimatedValue || 0
                )}
              </div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="no-data">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
