import { useState, useEffect } from "react";
import { vendorAPI } from "../services/api";
import "./VendorManagement.css";

function VendorManagement() {
  const [activeTab, setActiveTab] = useState("requests");
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

  // Create Vendor Form State
  const [createForm, setCreateForm] = useState({
    businessName: "",
    contactPerson: {
      firstName: "",
      lastName: "",
    },
    email: "",
    password: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    specializations: [],
    businessType: "Manufacturer",
  });

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

  const specializations = [
    "Fresh Fruits",
    "Fresh Vegetables",
    "Grains & Cereals",
    "Spices & Herbs",
    "Pulses & Legumes",
    "Oil Seeds",
    "Dairy Products",
    "Nuts & Dry Fruits",
    "Other",
  ];

  const businessTypes = [
    "Manufacturer",
    "Exporter",
    "Trader",
    "Supplier",
    "Farmer",
    "Cooperative",
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

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await vendorAPI.register(createForm);

      if (response.data.success) {
        setSuccess("Vendor created successfully and automatically approved!");
        // Reset form
        setCreateForm({
          businessName: "",
          contactPerson: {
            firstName: "",
            lastName: "",
          },
          email: "",
          password: "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          },
          specializations: [],
          businessType: "Manufacturer",
        });
        // Switch to requests tab to see the new vendor
        setActiveTab("requests");
        fetchVendors();

        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (err) {
      console.error("Error creating vendor:", err);
      setError(
        err.response?.data?.message || "Failed to create vendor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationChange = (specialization) => {
    const updatedSpecializations = createForm.specializations.includes(
      specialization
    )
      ? createForm.specializations.filter((s) => s !== specialization)
      : [...createForm.specializations, specialization];

    setCreateForm({
      ...createForm,
      specializations: updatedSpecializations,
    });
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
      {/* Tab Navigation */}
      <div className="vendor-tabs">
        <button
          className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          📋 Request Vendor
        </button>
        <button
          className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          ➕ Create Vendor
        </button>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Tab Content */}
      {activeTab === "requests" ? (
        <>
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
        </>
      ) : (
        /* Create Vendor Tab */
        <div className="create-vendor-section">
          <div className="create-vendor-header">
            <h3>Create New Vendor</h3>
            <p>Manually add a new vendor to the platform</p>
          </div>

          <form onSubmit={handleCreateVendor} className="create-vendor-form">
            <div className="form-section">
              <h4>Business Information</h4>

              <div className="form-group">
                <label>Business Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.businessName}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      businessName: e.target.value,
                    })
                  }
                  placeholder="Enter business name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact First Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.contactPerson.firstName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        contactPerson: {
                          ...createForm.contactPerson,
                          firstName: e.target.value,
                        },
                      })
                    }
                    placeholder="First name"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Last Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.contactPerson.lastName}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        contactPerson: {
                          ...createForm.contactPerson,
                          lastName: e.target.value,
                        },
                      })
                    }
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={createForm.phone}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter password (min 6 characters)"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Business Type</label>
                <select
                  value={createForm.businessType}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      businessType: e.target.value,
                    })
                  }
                >
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h4>Address Information</h4>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  required
                  value={createForm.address.street}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      address: {
                        ...createForm.address,
                        street: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    value={createForm.address.city}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        address: {
                          ...createForm.address,
                          city: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    required
                    value={createForm.address.state}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        address: {
                          ...createForm.address,
                          state: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    required
                    value={createForm.address.country}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        address: {
                          ...createForm.address,
                          country: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter country"
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={createForm.address.zipCode}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        address: {
                          ...createForm.address,
                          zipCode: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Specializations *</h4>
              <p className="form-helper">
                Select the product categories this vendor specializes in:
              </p>

              <div className="specializations-grid">
                {specializations.map((spec) => (
                  <label key={spec} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={createForm.specializations.includes(spec)}
                      onChange={() => handleSpecializationChange(spec)}
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>

              {createForm.specializations.length === 0 && (
                <p className="error-text">
                  Please select at least one specialization
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || createForm.specializations.length === 0}
              className="submit-btn"
            >
              {loading ? "Creating Vendor..." : "Create Vendor"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default VendorManagement;
