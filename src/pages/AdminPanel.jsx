import { useState } from 'react';
import AllOrders from '../components/AllOrders';
import './AdminPanel.css';

function AdminPanel() {
  const [activeSection, setActiveSection] = useState('all-orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: 'all-orders',
      label: 'All Orders',
      icon: '📋',
      component: AllOrders
    }
    // Future menu items can be added here
    // { id: 'users', label: 'Users', icon: '👥', component: Users },
    // { id: 'products', label: 'Products', icon: '📦', component: Products },
  ];

  const activeMenuItem = menuItems.find(item => item.id === activeSection);
  const ActiveComponent = activeMenuItem?.component;

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    // Redirect to login or home page
    window.location.href = '/login';
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <h2>🌱 Admin Panel</h2>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {isSidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <div className="header-content">
            <h1>{activeMenuItem?.label || 'Dashboard'}</h1>
            <div className="header-actions">
              <span className="admin-user">👤 Admin</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="welcome-section">
              <h2>Welcome to Admin Panel</h2>
              <p>Select an option from the sidebar to manage your application.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;