import { useState, useEffect } from "react";
import { productAPI, vendorAPI, authUtils } from "../services/api";
import "./VendorDashboard_New.css";

function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vendorInfo, setVendorInfo] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    activeProducts: 0,
    totalViews: 0,
  });

  const [productForm, setProductForm] = useState({
    name: "",
    category: "Fresh Fruits",
    description: "",
    unit: "KG",
    minOrderQuantity: 1,
    currentPrice: 0,
    quickOptions: [1, 5, 10],
    priceRange: { min: 0, max: 0, currency: "USD" },
    specifications: {
      origin: "",
      quality: "",
      packaging: "",
      shelfLife: "",
      certifications: [],
    },
    image: null,
    featured: false,
    availability: true,
  });

  const categories = [
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

  const units = [
    "KG",
    "MT (Metric Ton)",
    "Quintal",
    "Pieces",
    "Liters",
    "Pounds",
  ];

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const [productsResponse, profileResponse] = await Promise.all([
        productAPI.getVendorProducts(),
        vendorAPI.getProfile(),
      ]);

      if (productsResponse.data.success) {
        const productsData = productsResponse.data.data.products;
        setProducts(productsData);

        // Calculate stats
        setStats({
          totalProducts: productsData.length,
          featuredProducts: productsData.filter((p) => p.featured).length,
          activeProducts: productsData.filter((p) => p.availability).length,
          totalViews: Math.floor(Math.random() * 1000) + 100, // Mock data
        });
      }

      if (profileResponse.data.success) {
        setVendorInfo(profileResponse.data.data.vendor);
      }
    } catch (err) {
      console.error("Error fetching vendor data:", err);
      setError("Failed to load vendor data");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      // Basic product info
      formData.append("name", productForm.name);
      formData.append("category", productForm.category);
      formData.append("description", productForm.description);
      formData.append("unit", productForm.unit);
      formData.append("minOrderQuantity", productForm.minOrderQuantity);
      formData.append("currentPrice", productForm.currentPrice);
      formData.append("quickOptions", JSON.stringify(productForm.quickOptions));
      formData.append("priceRange", JSON.stringify(productForm.priceRange));
      formData.append(
        "specifications",
        JSON.stringify(productForm.specifications)
      );
      formData.append("featured", productForm.featured);
      formData.append("availability", productForm.availability);

      // Handle image file
      if (productForm.image && productForm.image instanceof File) {
        formData.append("image", productForm.image);
      }

      let response;
      if (editingProduct) {
        response = await productAPI.updateProduct(editingProduct._id, formData);
      } else {
        response = await productAPI.createProduct(formData);
      }

      if (response.data.success) {
        setSuccess(
          editingProduct
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        setShowAddProduct(false);
        setEditingProduct(null);
        resetProductForm();
        fetchVendorData();
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await productAPI.deleteProduct(productId);
      if (response.data.success) {
        setSuccess("Product deleted successfully!");
        fetchVendorData();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      category: "Fresh Fruits",
      description: "",
      unit: "KG",
      minOrderQuantity: 1,
      currentPrice: 0,
      quickOptions: [1, 5, 10],
      priceRange: { min: 0, max: 0, currency: "USD" },
      specifications: {
        origin: "",
        quality: "",
        packaging: "",
        shelfLife: "",
        certifications: [],
      },
      image: null,
      featured: false,
      availability: true,
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      unit: product.unit,
      minOrderQuantity: product.minOrderQuantity,
      currentPrice: product.currentPrice || 0,
      quickOptions: product.quickOptions || [1, 5, 10],
      priceRange: product.priceRange || { min: 0, max: 0, currency: "USD" },
      specifications: product.specifications || {
        origin: "",
        quality: "",
        packaging: "",
        shelfLife: "",
        certifications: [],
      },
      image: null,
      featured: product.featured || false,
      availability: product.availability !== false,
    });
    setShowAddProduct(true);
  };

  const handleLogout = () => {
    authUtils.clearVendorAuth();
    window.location.href = "/";
  };

  const formatPrice = (product) => {
    if (!product) return "Contact for price";

    // If currentPrice is available, show it prominently
    if (product.currentPrice && product.currentPrice > 0) {
      const currency = product.priceRange?.currency || "USD";
      const symbol =
        currency === "USD" ? "$" : currency === "INR" ? "₹" : currency;
      return `${symbol}${product.currentPrice}`;
    }

    // Fallback to price range if currentPrice is not available
    if (product.priceRange) {
      const { min, max, currency = "USD" } = product.priceRange;
      const symbol =
        currency === "USD" ? "$" : currency === "INR" ? "₹" : currency;
      return min === max ? `${symbol}${min}` : `${symbol}${min}-${max}`;
    }

    return "Contact for price";
  };

  const renderProductImage = (product) => {
    if (product.image?.url && product.image.url.startsWith("http")) {
      return (
        <img
          src={product.image.url}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "block";
          }}
        />
      );
    }
    return <div className="product-icon">{product.image?.url || "📦"}</div>;
  };

  if (loading && !products.length) {
    return (
      <div className="vendor-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="vendor-welcome">
            <div className="vendor-avatar">
              {vendorInfo?.businessName?.charAt(0) || "V"}
            </div>
            <div className="welcome-text">
              <h1>Welcome back!</h1>
              <p>{vendorInfo?.businessName || "Vendor Dashboard"}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <span>Logout</span>
              <span className="logout-icon">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
            <span className="nav-badge">{products.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="section-header">
              <h2>Dashboard Overview</h2>
              <p>Track your business performance and manage your products</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
                <div className="stat-trend positive">+12%</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>{stats.featuredProducts}</h3>
                  <p>Featured Products</p>
                </div>
                <div className="stat-trend positive">+5%</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{stats.activeProducts}</h3>
                  <p>Active Products</p>
                </div>
                <div className="stat-trend positive">+8%</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-content">
                  <h3>{stats.totalViews}</h3>
                  <p>Total Views</p>
                </div>
                <div className="stat-trend positive">+24%</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <button
                  className="action-card primary"
                  onClick={() => {
                    setShowAddProduct(true);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                >
                  <div className="action-icon">➕</div>
                  <div className="action-content">
                    <h4>Add New Product</h4>
                    <p>List a new product in your catalog</p>
                  </div>
                </button>
                <button
                  className="action-card"
                  onClick={() => setActiveTab("products")}
                >
                  <div className="action-icon">📝</div>
                  <div className="action-content">
                    <h4>Manage Products</h4>
                    <p>Edit existing products and inventory</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Products */}
            <div className="recent-products">
              <div className="section-header">
                <h3>Recent Products</h3>
                <button
                  className="view-all-btn"
                  onClick={() => setActiveTab("products")}
                >
                  View All
                </button>
              </div>
              <div className="products-preview">
                {products.slice(0, 3).map((product) => (
                  <div key={product._id} className="product-preview-card">
                    <div className="product-preview-image">
                      {renderProductImage(product)}
                    </div>
                    <div className="product-preview-content">
                      <h4>{product.name}</h4>
                      <p>{product.category}</p>
                      <div className="product-preview-price">
                        {formatPrice(product)} per {product.unit}
                      </div>
                    </div>
                    <div className="product-preview-status">
                      {product.availability ? (
                        <span className="status-badge active">Active</span>
                      ) : (
                        <span className="status-badge inactive">Inactive</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="products-section">
            <div className="section-header">
              <div>
                <h2>Product Management</h2>
                <p>Manage your product catalog and inventory</p>
              </div>
              <button
                className="add-product-btn"
                onClick={() => {
                  setShowAddProduct(true);
                  setEditingProduct(null);
                  resetProductForm();
                }}
              >
                <span>➕</span>
                Add Product
              </button>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-card-header">
                    <div className="product-image-container">
                      {renderProductImage(product)}
                      {product.featured && (
                        <div className="featured-badge">⭐ Featured</div>
                      )}
                    </div>
                    <div className="product-actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditProduct(product)}
                        title="Edit Product"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteProduct(product._id)}
                        title="Delete Product"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="product-card-content">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price">
                      {formatPrice(product)} per {product.unit}
                    </div>
                    <div className="product-meta">
                      <span className="min-order">
                        Min order: {product.minOrderQuantity} {product.unit}
                      </span>
                    </div>
                  </div>

                  <div className="product-card-footer">
                    <div className="product-status">
                      {product.availability ? (
                        <span className="status-indicator active">
                          <span className="status-dot"></span>
                          Active
                        </span>
                      ) : (
                        <span className="status-indicator inactive">
                          <span className="status-dot"></span>
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="product-views">
                      👁️ {Math.floor(Math.random() * 100) + 10} views
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No products yet</h3>
                <p>Start building your catalog by adding your first product</p>
                <button
                  className="empty-action-btn"
                  onClick={() => {
                    setShowAddProduct(true);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && vendorInfo && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Vendor Profile</h2>
              <p>Manage your business information and settings</p>
            </div>

            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    {vendorInfo.businessName?.charAt(0) || "V"}
                  </div>
                  <div className="profile-info">
                    <h3>{vendorInfo.businessName}</h3>
                    <p>
                      {vendorInfo.contactPerson?.firstName}{" "}
                      {vendorInfo.contactPerson?.lastName}
                    </p>
                    <div className="profile-status">
                      <span className={`status-badge ${vendorInfo.status}`}>
                        {vendorInfo.status?.charAt(0).toUpperCase() +
                          vendorInfo.status?.slice(1)}
                      </span>
                      {vendorInfo.verified && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-group">
                    <label>Contact Information</label>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{vendorInfo.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{vendorInfo.phone}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <label>Business Information</label>
                    <div className="detail-item">
                      <span className="detail-label">Business Type:</span>
                      <span className="detail-value">
                        {vendorInfo.businessDetails?.businessType || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Specializations:</span>
                      <div className="specializations-tags">
                        {vendorInfo.specializations?.map((spec) => (
                          <span key={spec} className="specialization-tag">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="detail-group">
                    <label>Address</label>
                    <div className="address-text">
                      {vendorInfo.address?.street}
                      <br />
                      {vendorInfo.address?.city}, {vendorInfo.address?.state}
                      <br />
                      {vendorInfo.address?.country}{" "}
                      {vendorInfo.address?.zipCode}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-section">
                <h4>Basic Information</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    required
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your product..."
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Unit *</label>
                    <select
                      value={productForm.unit}
                      onChange={(e) =>
                        setProductForm({ ...productForm, unit: e.target.value })
                      }
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Min Order Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={productForm.minOrderQuantity}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          minOrderQuantity: parseInt(e.target.value),
                        })
                      }
                      placeholder="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Price (USD) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={productForm.currentPrice}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          currentPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Price Range (Optional)</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price Range (Min) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={productForm.priceRange.min}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          priceRange: {
                            ...productForm.priceRange,
                            min: parseFloat(e.target.value),
                          },
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price Range (Max) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={productForm.priceRange.max}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          priceRange: {
                            ...productForm.priceRange,
                            max: parseFloat(e.target.value),
                          },
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Product Image</h4>

                <div className="form-group">
                  <label>Upload Image {!editingProduct && "*"}</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      required={!editingProduct}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          image: e.target.files[0],
                        })
                      }
                      className="file-input"
                    />
                    <div className="file-upload-text">
                      📷 Choose image or drag and drop
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Settings</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            featured: e.target.checked,
                          })
                        }
                      />
                      <span className="checkmark"></span>
                      Featured Product
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={productForm.availability}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            availability: e.target.checked,
                          })
                        }
                      />
                      <span className="checkmark"></span>
                      Available for Sale
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;
