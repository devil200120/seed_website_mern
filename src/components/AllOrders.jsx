import { useState, useEffect } from 'react';
import './AllOrders.css';

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Mock data - Replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          company: 'ABC Trading Co.',
          products: [
            { name: 'Premium Basmati Rice', quantity: 10, unit: 'MT' },
            { name: 'Fresh Onions', quantity: 5, unit: 'MT' }
          ],
          totalItems: 2,
          status: 'pending',
          orderDate: '2024-12-20',
          message: 'Please ensure organic certification for the rice.'
        },
        {
          id: 'ORD-002',
          customerName: 'Sarah Wilson',
          email: 'sarah@foodmart.com',
          phone: '+1 234 567 8901',
          company: 'FoodMart Industries',
          products: [
            { name: 'Turmeric Powder', quantity: 100, unit: 'KG' }
          ],
          totalItems: 1,
          status: 'confirmed',
          orderDate: '2024-12-19',
          message: 'Need delivery by end of month.'
        },
        {
          id: 'ORD-003',
          customerName: 'Michael Chen',
          email: 'mike@globalfood.com',
          phone: '+1 234 567 8902',
          company: 'Global Food Solutions',
          products: [
            { name: 'Alphonso Mangoes', quantity: 500, unit: 'KG' },
            { name: 'Chickpeas', quantity: 2, unit: 'MT' },
            { name: 'Sesame Seeds', quantity: 1, unit: 'MT' }
          ],
          totalItems: 3,
          status: 'processing',
          orderDate: '2024-12-18',
          message: 'Bulk order for international export.'
        },
        {
          id: 'ORD-004',
          customerName: 'Emma Rodriguez',
          email: 'emma@organicfoods.com',
          phone: '+1 234 567 8903',
          company: 'Organic Foods Ltd.',
          products: [
            { name: 'Fresh Onions', quantity: 20, unit: 'MT' }
          ],
          totalItems: 1,
          status: 'delivered',
          orderDate: '2024-12-17',
          message: 'Satisfied with previous orders, looking for long-term partnership.'
        },
        {
          id: 'ORD-005',
          customerName: 'David Kumar',
          email: 'david@spiceworld.com',
          phone: '+1 234 567 8904',
          company: 'Spice World International',
          products: [
            { name: 'Turmeric Powder', quantity: 250, unit: 'KG' },
            { name: 'Premium Basmati Rice', quantity: 25, unit: 'MT' }
          ],
          totalItems: 2,
          status: 'cancelled',
          orderDate: '2024-12-16',
          message: 'Changed requirements, may reorder with different specifications.'
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
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
      {/* Header with stats */}
      <div className="orders-stats">
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'processing').length}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'delivered').length}</h3>
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
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
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
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>
                  <div className="customer-info">
                    <strong>{order.customerName}</strong>
                    <small>{order.company}</small>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>{order.email}</div>
                    <div>{order.phone}</div>
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
                <td>{order.orderDate}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view" title="View Details">👁️</button>
                    <select 
                      className="status-update"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
    </div>
  );
}

export default AllOrders;