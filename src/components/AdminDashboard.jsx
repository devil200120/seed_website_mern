import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import ApiService from "../../service/api";
import OrderManagement from "./OrderManagement";
import ChatManagement from "./ChatManagement";
import AdminStats from "./AdminStats";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    totalValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getOrderStats();
      if (response.success) {
        setStats(response.stats);
        setRecentOrders(response.recentOrders || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📋 Orders ({stats.pendingOrders})
        </button>
        <button
          className={`tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat Support
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "stats" && (
          <AdminStats
            stats={stats}
            recentOrders={recentOrders}
            loading={loading}
            onRefresh={loadDashboardData}
          />
        )}

        {activeTab === "orders" && <OrderManagement />}

        {activeTab === "chat" && <ChatManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
