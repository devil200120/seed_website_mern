import { useState } from "react";
import AdminDashboard from "../components/AdminDashboard";
import VendorManagement from "../components/VendorManagement";
import QuotationManagement from "../components/QuotationManagement";
import CustomerManagement from "../components/CustomerManagement";
import "./AdminPanel.css";

function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "🏠",
      component: AdminDashboard,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "quotations",
      label: "Quotations",
      icon: "📝",
      component: QuotationManagement,
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: "vendors",
      label: "Vendors Management",
      icon: "🏪",
      component: VendorManagement,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      id: "customers",
      label: "Customers Management",
      icon: "👥",
      component: CustomerManagement,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
  ];

  const activeMenuItem = menuItems.find((item) => item.id === activeSection);
  const ActiveComponent = activeMenuItem?.component;

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    // Redirect to login or home page
    window.location.href = "/";
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <div className="logo-icon">🌱</div>
            {isSidebarOpen && (
              <div className="logo-text">
                <h2>SeedAdmin</h2>
                <span>Management Portal</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              {isSidebarOpen ? (
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              ) : (
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.id)}
              style={{
                background:
                  activeSection === item.id ? item.gradient : "transparent",
              }}
            >
              <div className="nav-icon-wrapper">
                <span className="nav-icon">{item.icon}</span>
              </div>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
              {activeSection === item.id && (
                <div className="nav-indicator"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-sidebar">
            {isSidebarOpen && (
              <div className="profile-compact">
                <div className="profile-avatar-small">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="Admin"
                  />
                </div>
                <div className="profile-info-small">
                  <span className="profile-name-small">John Admin</span>
                  <span className="profile-status">● Online</span>
                </div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <div className="nav-icon-wrapper">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </div>
            {isSidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`admin-main ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <header className="admin-header">
          <div className="header-content">
            <div className="header-left">
              <h1>{activeMenuItem?.label || "Dashboard"}</h1>
              <div className="breadcrumb">
                <span>Admin</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">
                  {activeMenuItem?.label || "Dashboard"}
                </span>
              </div>
            </div>
            <div className="header-actions">
              <div className="search-box-header">
                <svg
                  className="search-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input type="text" placeholder="Search..." />
              </div>
              <div className="notification-bell">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <span className="notification-badge">3</span>
              </div>
              <div className="admin-profile">
                <div className="profile-avatar">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Admin"
                  />
                </div>
                <div className="profile-info">
                  <span className="profile-name">John Admin</span>
                  <span className="profile-role">Super Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="welcome-section">
              <h2>Welcome to Admin Panel</h2>
              <p>
                Select an option from the sidebar to manage your application.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
