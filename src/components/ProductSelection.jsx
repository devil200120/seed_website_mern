import { useState, useEffect } from "react";
import { orderAPI, productAPI } from "../services/api";
import "./ProductSelection.css";

function ProductSelection() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all available products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          productAPI.getAllProducts({ availability: true, limit: 20 }),
          productAPI.getProductCategories(),
        ]);

        if (productsResponse.data.success) {
          console.log("Products fetched:", productsResponse.data.data.products);
          setProducts(productsResponse.data.data.products);
        }

        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data.categories);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again later.");

        // Fallback to default products if API fails
        setProducts(getDefaultProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Default fallback products
  const getDefaultProducts = () => [
    {
      _id: "default-1",
      name: "Premium Basmati Rice",
      category: "Grains & Cereals",
      image: { url: "🌾" },
      unit: "MT (Metric Ton)",
      minOrderQuantity: 1,
      quickOptions: [1, 5, 10, 25, 50],
      priceRange: { min: 800, max: 1200, currency: "USD" },
      vendor: { businessName: "Default Vendor" },
    },
    {
      _id: "default-2",
      name: "Fresh Onions",
      category: "Fresh Vegetables",
      image: { url: "🧅" },
      unit: "MT (Metric Ton)",
      minOrderQuantity: 5,
      quickOptions: [5, 10, 20, 50, 100],
      priceRange: { min: 200, max: 400, currency: "USD" },
      vendor: { businessName: "Default Vendor" },
    },
    {
      _id: "default-3",
      name: "Turmeric Powder",
      category: "Spices & Herbs",
      image: { url: "🌶️" },
      unit: "KG",
      minOrderQuantity: 25,
      quickOptions: [25, 50, 100, 250, 500],
      priceRange: { min: 3, max: 8, currency: "USD" },
      vendor: { businessName: "Default Vendor" },
    },
    {
      _id: "default-4",
      name: "Alphonso Mangoes",
      category: "Fresh Fruits",
      image: { url: "🥭" },
      unit: "KG",
      minOrderQuantity: 100,
      quickOptions: [100, 250, 500, 1000, 2000],
      priceRange: { min: 2, max: 5, currency: "USD" },
      vendor: { businessName: "Default Vendor" },
    },
    {
      _id: "default-5",
      name: "Chickpeas",
      category: "Pulses & Legumes",
      image: { url: "🫘" },
      unit: "MT (Metric Ton)",
      minOrderQuantity: 1,
      quickOptions: [1, 2, 5, 10, 25],
      priceRange: { min: 600, max: 900, currency: "USD" },
      vendor: { businessName: "Default Vendor" },
    },
    {
      _id: "default-6",
      name: "Sesame Seeds",
      category: "Oil Seeds",
      image: { url: "🌻" },
      unit: "MT (Metric Ton)",
      minOrderQuantity: 1,
      quickOptions: [1, 3, 5, 10, 20],
      priceRange: { min: 1200, max: 1800, currency: "USD" },
      vendor: { businessName: "Default Vendor" },
    },
  ];

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleQuantityChange = (productId, quantity) => {
    const product = products.find((p) => p._id === productId);
    const numQuantity = parseInt(quantity) || 0;

    if (numQuantity === 0) {
      setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
    } else {
      setSelectedProducts((prev) => {
        const existing = prev.find((p) => p._id === productId);
        if (existing) {
          return prev.map((p) =>
            p._id === productId ? { ...p, quantity: numQuantity } : p
          );
        } else {
          return [...prev, { ...product, quantity: numQuantity }];
        }
      });
    }
  };

  const handleQuickSelect = (productId, quantity) => {
    handleQuantityChange(productId, quantity);
  };

  const getCurrentQuantity = (productId) => {
    const selected = selectedProducts.find((p) => p._id === productId);
    return selected ? selected.quantity : "";
  };

  // Calculate total price based on current prices and quantities
  const calculateTotalPrice = () => {
    return selectedProducts.reduce((total, product) => {
      let unitPrice = 0;

      // Use currentPrice if available, otherwise use average of priceRange
      if (product.currentPrice && product.currentPrice > 0) {
        unitPrice = product.currentPrice;
      } else if (
        product.priceRange &&
        product.priceRange.min &&
        product.priceRange.max
      ) {
        unitPrice = (product.priceRange.min + product.priceRange.max) / 2;
      }

      return total + unitPrice * product.quantity;
    }, 0);
  };

  // Get price details for summary
  const getPriceDetails = () => {
    const subtotal = calculateTotalPrice();
    const taxRate = 0.18; // 18% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      currency: selectedProducts[0]?.priceRange?.currency || "USD",
    };
  };

  // WhatsApp redirect function
  const redirectToWhatsApp = (orderNumber, estimatedTotal, customerName) => {
    const whatsappNumber = "14319906055"; // WhatsApp number without + sign
    const message = `Hello! I just submitted a quote request on Field to Feed Export.

📋 *Order Details:*
• Order Number: ${orderNumber}
• Customer Name: ${customerName}
• Estimated Total: $${estimatedTotal.toLocaleString()}
• Products: ${selectedProducts.length} items

I'm interested in proceeding with this order. Please let me know the next steps.

Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Validate required address fields
    const requiredAddressFields = [
      "street",
      "city",
      "state",
      "country",
      "zipCode",
    ];
    const missingFields = requiredAddressFields.filter(
      (field) => !contactData.address[field].trim()
    );

    if (missingFields.length > 0) {
      setSubmitMessage(
        `❌ Please fill in all required address fields: ${missingFields.join(
          ", "
        )}`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const priceDetails = getPriceDetails();

      // Prepare order data with price calculations
      const orderData = {
        customerInfo: {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
        },
        deliveryAddress: {
          street: contactData.address.street,
          city: contactData.address.city,
          state: contactData.address.state,
          country: contactData.address.country,
          zipCode: contactData.address.zipCode,
        },
        products: selectedProducts.map((product) => {
          let unitPrice = 0;

          // Use currentPrice if available, otherwise use average of priceRange
          if (product.currentPrice && product.currentPrice > 0) {
            unitPrice = product.currentPrice;
          } else if (
            product.priceRange &&
            product.priceRange.min &&
            product.priceRange.max
          ) {
            unitPrice = (product.priceRange.min + product.priceRange.max) / 2;
          }

          return {
            productId: product._id,
            name: product.name,
            category: product.category,
            quantity: product.quantity,
            unit: product.unit,
            estimatedPrice: unitPrice,
            lineTotal: unitPrice * product.quantity,
          };
        }),
        requirements: contactData.message,
        priceCalculation: {
          subtotal: parseFloat(priceDetails.subtotal),
          taxRate: 0.18,
          taxAmount: parseFloat(priceDetails.taxAmount),
          total: parseFloat(priceDetails.total),
          currency: priceDetails.currency,
        },
      };

      // Submit order to backend
      const response = await orderAPI.createOrder(orderData);

      if (response.data.success) {
        const orderNumber = response.data.data.order.orderNumber;
        const estimatedTotal = response.data.data.order.estimatedTotal;
        setSubmitMessage(
          `✅ Order ${orderNumber} submitted successfully! You will receive a confirmation email with quote details. Redirecting to WhatsApp for further assistance...`
        );

        // Redirect to WhatsApp after 2 seconds
        setTimeout(() => {
          redirectToWhatsApp(orderNumber, estimatedTotal, contactData.name);
        }, 2000);

        // Reset form after successful submission
        setTimeout(() => {
          setSelectedProducts([]);
          setContactData({
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
            address: {
              street: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
          });
          setShowContactForm(false);
          setSubmitMessage("");
        }, 5000); // Extended to 5 seconds to allow WhatsApp redirect
      }
    } catch (error) {
      console.error("Order submission error:", error);

      let errorMessage = "Failed to submit order. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err) => err.message)
          .join(", ");
      }

      setSubmitMessage(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactChange = (field, value) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setContactData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setContactData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const formatPrice = (product) => {
    // Prioritize currentPrice if available
    if (product.currentPrice && product.currentPrice > 0) {
      const currency = product.priceRange?.currency || "USD";
      const symbol =
        currency === "USD" ? "$" : currency === "INR" ? "₹" : currency;
      return {
        price: `${symbol}${product.currentPrice.toLocaleString()}`,
        isCurrentPrice: true,
        originalPrice: product.priceRange
          ? `${symbol}${product.priceRange.min}-${product.priceRange.max}`
          : null,
      };
    }

    // Fallback to priceRange
    if (!product.priceRange)
      return { price: "Contact for price", isCurrentPrice: false };
    const { min, max, currency = "USD" } = product.priceRange;
    const symbol =
      currency === "USD" ? "$" : currency === "INR" ? "₹" : currency;
    return {
      price: `${symbol}${min.toLocaleString()}-${max.toLocaleString()}`,
      isCurrentPrice: false,
    };
  };

  const renderProductImage = (product) => {
    // If it's a Cloudinary image URL, use it directly
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
    // Otherwise, use emoji or placeholder
    return <div className="product-icon">{product.image?.url || "📦"}</div>;
  };

  if (loading) {
    return (
      <section className="product-selection" id="product-selection">
        <div className="container">
          <div className="section-header">
            <h2>Select Products & Get Quote</h2>
            <p>Loading products...</p>
          </div>
          <div className="loading-spinner">Loading...</div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="product-selection" id="product-selection">
        <div className="container">
          <div className="section-header">
            <h2>Select Products & Get Quote</h2>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-selection" id="product-selection">
      <div className="container">
        <div className="section-header">
          <h2>Select Products & Get Quote</h2>
          <p>
            Choose your products and quantities to receive a personalized quote
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="category-filter">
            <button
              className={`category-btn ${
                selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="products-selection-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-selection-card">
              <div className="land-product-header">
                {renderProductImage(product)}
                <div
                  className="product-icon-fallback"
                  style={{ display: "none" }}
                >
                  📦
                </div>
                <h3>{product.name}</h3>
                <span className="land-product-category">
                  {product.category}
                </span>
                <div className="product-vendor">
                  by {product.vendor?.businessName || "Unknown Vendor"}
                </div>
              </div>

              <div className="quantity-selector">
                <label>Quantity ({product.unit})</label>

                {/* Quick Selection Options */}
                {product.quickOptions && product.quickOptions.length > 0 && (
                  <div className="quick-options">
                    <span className="quick-label">Quick Select:</span>
                    <div className="quick-buttons">
                      {product.quickOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`quick-btn ${
                            getCurrentQuantity(product._id) === option
                              ? "active"
                              : ""
                          }`}
                          onClick={() => handleQuickSelect(product._id, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Input */}
                <div className="custom-input">
                  <span className="custom-label">Custom Quantity:</span>
                  <input
                    type="number"
                    min={product.minOrderQuantity}
                    placeholder={`Min: ${product.minOrderQuantity}`}
                    onChange={(e) =>
                      handleQuantityChange(product._id, e.target.value)
                    }
                    value={getCurrentQuantity(product._id)}
                    className="quantity-input"
                  />
                </div>

                <small>
                  Minimum order: {product.minOrderQuantity} {product.unit}
                </small>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found in this category.</p>
          </div>
        )}

        {selectedProducts.length > 0 && (
          <div className="selected-products-summary">
            <h3>Selected Products ({selectedProducts.length})</h3>
            <div className="selected-list">
              {selectedProducts.map((product) => (
                <div key={product._id} className="selected-item">
                  <span className="product-info">
                    {renderProductImage(product)} {product.name}
                  </span>
                  <span className="quantity-info">
                    {product.quantity} {product.unit}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => handleQuantityChange(product._id, 0)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="action-buttons">
              <button
                className="btn-primary get-quote-btn"
                onClick={() => setShowContactForm(true)}
              >
                Get Quote for Selected Products
              </button>
              <button
                className="btn-whatsapp"
                onClick={() => {
                  const message = `Hello! I'm interested in getting a quote for the following products from Field to Feed Export:

${selectedProducts
  .map((product) => `• ${product.name}: ${product.quantity} ${product.unit}`)
  .join("\n")}

Please provide me with pricing and availability information.

Thank you!`;
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/14319906055?text=${encodedMessage}`;
                  window.open(whatsappUrl, "_blank");
                }}
              >
                💬 Quick WhatsApp Chat
              </button>
            </div>
          </div>
        )}

        {showContactForm && (
          <div
            className="contact-form-overlay"
            onClick={(e) => {
              if (e.target.className === "contact-form-overlay") {
                setShowContactForm(false);
              }
            }}
          >
            <div
              className="contact-form-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Request Quote</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowContactForm(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleContactSubmit} className="quote-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={contactData.name}
                        onChange={(e) =>
                          handleContactChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        value={contactData.company}
                        onChange={(e) =>
                          handleContactChange("company", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={contactData.email}
                        onChange={(e) =>
                          handleContactChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={contactData.phone}
                        onChange={(e) =>
                          handleContactChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="address-section">
                    <h4>Delivery Address</h4>
                    <div className="form-group">
                      <label htmlFor="street">Street Address *</label>
                      <input
                        type="text"
                        id="street"
                        required
                        placeholder="Enter street address"
                        value={contactData.address.street}
                        onChange={(e) =>
                          handleContactChange("address.street", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          id="city"
                          required
                          placeholder="Enter city"
                          value={contactData.address.city}
                          onChange={(e) =>
                            handleContactChange("address.city", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="state">State/Province *</label>
                        <input
                          type="text"
                          id="state"
                          required
                          placeholder="Enter state/province"
                          value={contactData.address.state}
                          onChange={(e) =>
                            handleContactChange("address.state", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="country">Country *</label>
                        <input
                          type="text"
                          id="country"
                          required
                          placeholder="Enter country"
                          value={contactData.address.country}
                          onChange={(e) =>
                            handleContactChange(
                              "address.country",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="zipCode">ZIP/Postal Code *</label>
                        <input
                          type="text"
                          id="zipCode"
                          required
                          placeholder="Enter ZIP/postal code"
                          value={contactData.address.zipCode}
                          onChange={(e) =>
                            handleContactChange(
                              "address.zipCode",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Additional Requirements</label>
                    <textarea
                      id="message"
                      rows="3"
                      placeholder="Please mention any specific requirements, delivery preferences, quality specifications, etc."
                      value={contactData.message}
                      onChange={(e) =>
                        handleContactChange("message", e.target.value)
                      }
                    ></textarea>
                  </div>

                  <div className="selected-products-in-form">
                    <h4>Selected Products:</h4>
                    {selectedProducts.map((product) => {
                      return (
                        <div key={product._id} className="product-in-form">
                          <div className="product-line">
                            <span className="product-name">{product.name}</span>
                            <span className="product-quantity">
                              {product.quantity} {product.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {selectedProducts.length > 0 && (
                      <>
                        {/* Delivery Address Summary */}
                        {(contactData.address.street ||
                          contactData.address.city) && (
                          <div className="address-summary">
                            <h5>📍 Delivery Address:</h5>
                            <p className="address-text">
                              {contactData.address.street &&
                                `${contactData.address.street}, `}
                              {contactData.address.city &&
                                `${contactData.address.city}, `}
                              {contactData.address.state &&
                                `${contactData.address.state}, `}
                              {contactData.address.country &&
                                `${contactData.address.country} `}
                              {contactData.address.zipCode &&
                                contactData.address.zipCode}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {submitMessage && (
                    <div
                      className={`submit-message ${
                        submitMessage.includes("✅") ? "success" : "error"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => setShowContactForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductSelection;
