import { useState, useEffect } from "react";
import { vendorAPI } from "../services/api";
import "./VendorManagement.css";

function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    specialization: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "suspended", label: "Suspended" },
  ];

  const specializationOptions = [
    { value: "all", label: "All Specializations" },
    { value: "Fresh Fruits", label: "Fresh Fruits" },
    { value: "Fresh Vegetables", label: "Fresh Vegetables" },
    { value: "Grains & Cereals", label: "Grains & Cereals" },
    { value: "Spices & Herbs", label: "Spices & Herbs" },
    { value: "Pulses & Legumes", label: "Pulses & Legumes" },
    { value: "Oil Seeds", label: "Oil Seeds" },
    { value: "Dairy Products", label: "Dairy Products" },
    { value: "Nuts & Dry Fruits", label: "Nuts & Dry Fruits" },
  ];

  useEffect(() => {
    fetchVendors();
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.specialization !== "all" && {
          specialization: filters.specialization,
        }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await vendorAPI.getAllVendors(params);

      if (response.data.success) {
        setVendors(response.data.data.vendors);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.pagination.total,
          pages: response.data.data.pagination.pages,
        }));
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (vendorId, newStatus) => {
    try {
      setLoading(true);
      const response = await vendorAPI.updateVendorStatus(vendorId, newStatus);

      if (response.data.success) {
        setSuccess(`Vendor status updated to ${newStatus} successfully!`);
        fetchVendors(); // Refresh the list
        setShowDetails(false);
        setSelectedVendor(null);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error updating vendor status:", err);
      setError(err.response?.data?.message || "Failed to update vendor status");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetails(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "pending", icon: "⏳", label: "Pending" },
      approved: { class: "approved", icon: "✅", label: "Approved" },
      rejected: { class: "rejected", icon: "❌", label: "Rejected" },
      suspended: { class: "suspended", icon: "⚠️", label: "Suspended" },
    };

    const config = statusConfig[status] || {
      class: "unknown",
      icon: "?",
      label: status,
    };

    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVendorStats = () => {
    const stats = vendors.reduce((acc, vendor) => {
      acc[vendor.status] = (acc[vendor.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: vendors.length,
      pending: stats.pending || 0,
      approved: stats.approved || 0,
      rejected: stats.rejected || 0,
      suspended: stats.suspended || 0,
    };
  };

  const stats = getVendorStats();

  if (error && vendors.length === 0) {
    return (
      <div className="vendor-management">
        <div className="error-state">
          <h3>⚠️ Error Loading Vendors</h3>
          <p>{error}</p>
          <button onClick={fetchVendors} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-management">
      {/* Header */}
      <div className="vendor-header">
        <div className="header-content">
          <h1>Vendor Management</h1>
          <p>Manage vendor registrations, approvals, and account status</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchVendors} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="vendor-stats">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Vendors</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Filters */}
      <div className="vendor-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search vendors by name, email, or business..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍 Search
          </button>
        </form>

        <div className="filter-selects">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="filter-select"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.specialization}
            onChange={(e) =>
              handleFilterChange("specialization", e.target.value)
            }
            className="filter-select"
          >
            {specializationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="vendors-table-container">
        {loading && vendors.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading vendors...</p>
          </div>
        ) : (
          <table className="vendors-table">
            <thead>
              <tr>
                <th>Business Info</th>
                <th>Contact Person</th>
                <th>Specializations</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>
                    <div className="business-info">
                      <div className="business-name">{vendor.businessName}</div>
                      <div className="business-email">{vendor.email}</div>
                      <div className="business-type">
                        {vendor.businessDetails?.businessType}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-name">
                        {vendor.contactPerson?.firstName}{" "}
                        {vendor.contactPerson?.lastName}
                      </div>
                      <div className="contact-phone">{vendor.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div className="specializations">
                      {vendor.specializations?.slice(0, 2).map((spec) => (
                        <span key={spec} className="specialization-tag">
                          {spec}
                        </span>
                      ))}
                      {vendor.specializations?.length > 2 && (
                        <span className="more-specs">
                          +{vendor.specializations.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(vendor.status)}</td>
                  <td>
                    <div className="date-info">
                      {formatDate(vendor.joinedAt)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewDetails(vendor)}
                        className="action-btn view"
                        title="View Details"
                      >
                        👁️
                      </button>
                      {vendor.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(vendor._id, "approved")
                            }
                            className="action-btn approve"
                            title="Approve Vendor"
                            disabled={loading}
                          >
                            ✅
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(vendor._id, "rejected")
                            }
                            className="action-btn reject"
                            title="Reject Vendor"
                            disabled={loading}
                          >
                            ❌
                          </button>
                        </>
                      )}
                      {vendor.status === "approved" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(vendor._id, "suspended")
                          }
                          className="action-btn suspend"
                          title="Suspend Vendor"
                          disabled={loading}
                        >
                          ⚠️
                        </button>
                      )}
                      {vendor.status === "suspended" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(vendor._id, "approved")
                          }
                          className="action-btn reactivate"
                          title="Reactivate Vendor"
                          disabled={loading}
                        >
                          🔄
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {vendors.length === 0 && !loading && (
          <div className="empty-state">
            <h3>No vendors found</h3>
            <p>No vendors match your current filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={pagination.page === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
            total)
          </span>

          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(prev.pages, prev.page + 1),
              }))
            }
            disabled={pagination.page === pagination.pages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Vendor Details Modal */}
      {showDetails && selectedVendor && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Vendor Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="vendor-details">
                <div className="detail-section">
                  <h4>Business Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Business Name:</label>
                      <span>{selectedVendor.businessName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Business Type:</label>
                      <span>
                        {selectedVendor.businessDetails?.businessType}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedVendor.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedVendor.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Contact Person</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>
                        {selectedVendor.contactPerson?.firstName}{" "}
                        {selectedVendor.contactPerson?.lastName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Address</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Street:</label>
                      <span>{selectedVendor.address?.street}</span>
                    </div>
                    <div className="detail-item">
                      <label>City:</label>
                      <span>{selectedVendor.address?.city}</span>
                    </div>
                    <div className="detail-item">
                      <label>State:</label>
                      <span>{selectedVendor.address?.state}</span>
                    </div>
                    <div className="detail-item">
                      <label>Country:</label>
                      <span>{selectedVendor.address?.country}</span>
                    </div>
                    <div className="detail-item">
                      <label>ZIP Code:</label>
                      <span>{selectedVendor.address?.zipCode}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Specializations</h4>
                  <div className="specializations-list">
                    {selectedVendor.specializations?.map((spec) => (
                      <span key={spec} className="specialization-tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Account Status</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Status:</label>
                      {getStatusBadge(selectedVendor.status)}
                    </div>
                    <div className="detail-item">
                      <label>Verified:</label>
                      <span>
                        {selectedVendor.verified ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Joined:</label>
                      <span>{formatDate(selectedVendor.joinedAt)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Last Active:</label>
                      <span>{formatDate(selectedVendor.lastActive)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedVendor.status === "pending" && (
                <div className="approval-actions">
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedVendor._id, "approved")
                    }
                    className="approve-btn"
                    disabled={loading}
                  >
                    ✅ Approve Vendor
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedVendor._id, "rejected")
                    }
                    className="reject-btn"
                    disabled={loading}
                  >
                    ❌ Reject Vendor
                  </button>
                </div>
              )}
              {selectedVendor.status === "approved" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedVendor._id, "suspended")
                  }
                  className="suspend-btn"
                  disabled={loading}
                >
                  ⚠️ Suspend Vendor
                </button>
              )}
              {selectedVendor.status === "suspended" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedVendor._id, "approved")
                  }
                  className="reactivate-btn"
                  disabled={loading}
                >
                  🔄 Reactivate Vendor
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorManagement;
