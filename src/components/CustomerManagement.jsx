import { useState, useEffect } from "react";
import "./CustomerManagement.css";

function CustomerManagement() {
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [customers, setCustomers] = useState([]);

  // Create Customer Form State
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (activeTab === "list") {
      fetchCustomers();
    }
  }, [activeTab]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch customers
      // const response = await customerAPI.getAllCustomers();
      // setCustomers(response.data.data.customers);
      
      // Mock data for now
      setCustomers([
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 234 567 8900",
          company: "ABC Corp",
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Implement API call to create customer
      // const response = await customerAPI.createCustomer(createForm);

      setSuccess("Customer created successfully!");
      
      // Reset form
      setCreateForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        company: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
      });

      // Switch to list tab to see the new customer
      setTimeout(() => {
        setActiveTab("list");
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Error creating customer:", err);
      setError(
        err.response?.data?.message || "Failed to create customer. Please try again."
      );
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="customer-management">
      {/* Tab Navigation */}
      <div className="customer-tabs">
        <button
          className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          ➕ Create Customer
        </button>
        <button
          className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          👥 Customer List
        </button>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Tab Content */}
      {activeTab === "create" ? (
        /* Create Customer Tab */
        <div className="create-customer-section">
          <div className="create-customer-header">
            <h3>Create New Customer</h3>
            <p>Add a new customer account to the platform</p>
          </div>

          <form onSubmit={handleCreateCustomer} className="create-customer-form">
            <div className="form-section">
              <h4>Personal Information</h4>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                />
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

              <div className="form-row">
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
                  <label>Company (Optional)</label>
                  <input
                    type="text"
                    value={createForm.company}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        company: e.target.value,
                      })
                    }
                    placeholder="Enter company name"
                  />
                </div>
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

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? "Creating Customer..." : "Create Customer"}
            </button>
          </form>
        </div>
      ) : (
        /* Customer List Tab */
        <div className="customer-list-section">
          <div className="customer-list-header">
            <h3>Customer List</h3>
            <p>View and manage all registered customers</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Customers Yet</h3>
              <p>Create your first customer to get started</p>
              <button
                className="empty-action-btn"
                onClick={() => setActiveTab("create")}
              >
                Create Customer
              </button>
            </div>
          ) : (
            <div className="customers-table-container">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="customer-name">{customer.name}</div>
                      </td>
                      <td>
                        <div className="customer-email">{customer.email}</div>
                      </td>
                      <td>
                        <div className="customer-phone">{customer.phone}</div>
                      </td>
                      <td>
                        <div className="customer-company">
                          {customer.company || "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn edit"
                            title="Edit Customer"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete Customer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
