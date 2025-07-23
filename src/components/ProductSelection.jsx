import { useState } from 'react';

function ProductSelection() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Basmati Rice",
      category: "Grains & Cereals",
      image: "🌾",
      unit: "MT (Metric Ton)",
      minOrder: 1,
      quickOptions: [1, 5, 10, 25, 50]
    },
    {
      id: 2,
      name: "Fresh Onions",
      category: "Fresh Vegetables",
      image: "🧅",
      unit: "MT (Metric Ton)",
      minOrder: 5,
      quickOptions: [5, 10, 20, 50, 100]
    },
    {
      id: 3,
      name: "Turmeric Powder",
      category: "Spices & Herbs",
      image: "🌶️",
      unit: "KG",
      minOrder: 25,
      quickOptions: [25, 50, 100, 250, 500]
    },
    {
      id: 4,
      name: "Alphonso Mangoes",
      category: "Fresh Fruits",
      image: "🥭",
      unit: "KG",
      minOrder: 100,
      quickOptions: [100, 250, 500, 1000, 2000]
    },
    {
      id: 5,
      name: "Chickpeas",
      category: "Pulses & Legumes",
      image: "🫘",
      unit: "MT (Metric Ton)",
      minOrder: 1,
      quickOptions: [1, 2, 5, 10, 25]
    },
    {
      id: 6,
      name: "Sesame Seeds",
      category: "Oil Seeds",
      image: "🌻",
      unit: "MT (Metric Ton)",
      minOrder: 1,
      quickOptions: [1, 3, 5, 10, 20]
    }
  ];

  const handleQuantityChange = (productId, quantity) => {
    const product = featuredProducts.find(p => p.id === productId);
    const numQuantity = parseInt(quantity) || 0;
    
    if (numQuantity === 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    } else {
      setSelectedProducts(prev => {
        const existing = prev.find(p => p.id === productId);
        if (existing) {
          return prev.map(p => 
            p.id === productId 
              ? { ...p, quantity: numQuantity }
              : p
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
    const selected = selectedProducts.find(p => p.id === productId);
    return selected ? selected.quantity : '';
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    // Create message with selected products
    const productList = selectedProducts.map(p => 
      `${p.name}: ${p.quantity} ${p.unit}`
    ).join('\n');
    
    const fullMessage = `${contactData.message}\n\nSelected Products:\n${productList}`;
    
    // Here you would typically send the data to your backend
    console.log('Contact form submitted:', {
      ...contactData,
      selectedProducts,
      message: fullMessage
    });
    
    alert('Thank you for your inquiry! We will contact you soon.');
    
    // Reset form
    setSelectedProducts([]);
    setContactData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    });
    setShowContactForm(false);
  };

  const handleContactChange = (field, value) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="product-selection" id="product-selection">
      <div className="container">
        <div className="section-header">
          <h2>Select Products & Get Quote</h2>
          <p>Choose your products and quantities to receive a personalized quote</p>
        </div>
        
        <div className="products-selection-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-selection-card">
              <div className="product-header">
                <div className="product-icon">{product.image}</div>
                <h3>{product.name}</h3>
                <span className="product-category">{product.category}</span>
              </div>
              
              <div className="quantity-selector">
                <label>Quantity ({product.unit})</label>
                
                {/* Quick Selection Options */}
                <div className="quick-options">
                  <span className="quick-label">Quick Select:</span>
                  <div className="quick-buttons">
                    {product.quickOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`quick-btn ${getCurrentQuantity(product.id) === option ? 'active' : ''}`}
                        onClick={() => handleQuickSelect(product.id, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input */}
                <div className="custom-input">
                  <span className="custom-label">Custom Quantity:</span>
                  <input
                    type="number"
                    min={product.minOrder}
                    placeholder={`Min: ${product.minOrder}`}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    value={getCurrentQuantity(product.id)}
                    className="quantity-input"
                  />
                </div>
                
                <small>Minimum order: {product.minOrder} {product.unit}</small>
              </div>
            </div>
          ))}
        </div>

        {selectedProducts.length > 0 && (
          <div className="selected-products-summary">
            <h3>Selected Products ({selectedProducts.length})</h3>
            <div className="selected-list">
              {selectedProducts.map((product) => (
                <div key={product.id} className="selected-item">
                  <span className="product-info">
                    {product.image} {product.name}
                  </span>
                  <span className="quantity-info">
                    {product.quantity} {product.unit}
                  </span>
                  <button 
                    className="remove-btn"
                    onClick={() => handleQuantityChange(product.id, 0)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button 
              className="btn-primary get-quote-btn"
              onClick={() => setShowContactForm(true)}
            >
              Get Quote for Selected Products
            </button>
          </div>
        )}

        {showContactForm && (
          <div className="contact-form-overlay" onClick={(e) => {
            if (e.target.className === 'contact-form-overlay') {
              setShowContactForm(false);
            }
          }}>
            <div className="contact-form-modal" onClick={(e) => e.stopPropagation()}>
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
                        onChange={(e) => handleContactChange('name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        value={contactData.company}
                        onChange={(e) => handleContactChange('company', e.target.value)}
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
                        onChange={(e) => handleContactChange('email', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={contactData.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Additional Requirements</label>
                    <textarea
                      id="message"
                      rows="3"
                      placeholder="Please mention any specific requirements, delivery preferences, quality specifications, etc."
                      value={contactData.message}
                      onChange={(e) => handleContactChange('message', e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="selected-products-in-form">
                    <h4>Selected Products:</h4>
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="product-in-form">
                        {product.name}: {product.quantity} {product.unit}
                      </div>
                    ))}
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn-outline" onClick={() => setShowContactForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Submit Quote Request
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