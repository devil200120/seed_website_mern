import { useState, useEffect } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    country: '',
    quantity: '',
    timeline: '',
    message: '',
    preferredContact: 'email',
    subscribe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isMobile, setIsMobile] = useState(false);
   useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fix for mobile viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    
    return () => window.removeEventListener('resize', setVH);
  }, []);

useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Product categories with icons
  const productCategories = [
    { value: 'vegetables', label: 'Fresh Vegetables', icon: '🥬' },
    { value: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
    { value: 'spices', label: 'Spices & Herbs', icon: '🌶️' },
    { value: 'grains', label: 'Grains & Cereals', icon: '🌾' },
    { value: 'pulses', label: 'Pulses & Legumes', icon: '🫘' },
    { value: 'oil-seeds', label: 'Oil Seeds', icon: '🌻' },
    { value: 'processed', label: 'Processed Foods', icon: '🥫' },
    { value: 'organic', label: 'Organic Products', icon: '🌱' },
    { value: 'other', label: 'Other Products', icon: '📦' }
  ];

  const timelineOptions = [
    { value: 'immediate', label: 'Immediate (Within 1 week)' },
    { value: 'short', label: 'Short term (1-4 weeks)' },
    { value: 'medium', label: 'Medium term (1-3 months)' },
    { value: 'long', label: 'Long term (3+ months)' },
    { value: 'ongoing', label: 'Ongoing partnership' }
  ];

  const quantityRanges = [
    { value: 'small', label: 'Small (< 1 ton)' },
    { value: 'medium', label: 'Medium (1-10 tons)' },
    { value: 'large', label: 'Large (10-100 tons)' },
    { value: 'bulk', label: 'Bulk (100+ tons)' },
    { value: 'custom', label: 'Custom quantity' }
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.category) newErrors.category = 'Product category is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '', email: '', phone: '', company: '', category: '',
        country: '', quantity: '', timeline: '', message: '',
        preferredContact: 'email', subscribe: false
      });
      
      // Auto-clear success message
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="page-container">
      {/* Page Hero Section */}
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Ready to expand your business globally? Let's discuss your requirements</p>
        </div>
      </section>

      {/* Premium Contact Section */}
      <section className="contact-premium page-content">
        <div className="container">
        <div className={`contact-layout ${isMobile ? 'mobile-layout' : ''}`}>
            {/* Contact Information Cards */}
            <div className="contact-info-premium">
              {/* Quick Connect Card */}
              <div className="info-card featured-card">
                <div className="card-header">
                  <div className="card-icon">🚀</div>
                  <h3>Quick Connect</h3>
                </div>
                <div className="quick-actions">
                  <a href="tel:+919876543210" className="quick-action">
                    <div className="action-icon">📞</div>
                    <div className="action-content">
                      <span className="action-label">Call Now</span>
                      <span className="action-value">+91 98765 43210</span>
                    </div>
                  </a>
                  <a href="mailto:info@fieldtofeedexport.com" className="quick-action">
                    <div className="action-icon">✉️</div>
                    <div className="action-content">
                      <span className="action-label">Email Us</span>
                      <span className="action-value">info@fieldtofeedexport.com</span>
                    </div>
                  </a>
                  <a href="#" className="quick-action">
                    <div className="action-icon">💬</div>
                    <div className="action-content">
                      <span className="action-label">WhatsApp</span>
                      <span className="action-value">Quick Response</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Office Details */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">🏢</div>
                  <h3>Head Office</h3>
                </div>
                <div className="office-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <div>
                      <strong>Address</strong>
                      <p>123 Export Plaza, Agricultural District<br />Mumbai, Maharashtra 400001, India</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕒</span>
                    <div>
                      <strong>Business Hours</strong>
                      <p>Mon-Fri: 9:00 AM - 6:00 PM<br />Sat: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="info-card stats-card">
                <h3>Why Choose Us?</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Partner Farmers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Countries</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Quality Assured</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Contact Form */}
            <div className="contact-form-premium">
              <div className="form-header">
                <h3>Send Us Your Requirements</h3>
                <p>Fill out the form below and we'll get back to you within 24 hours</p>
              </div>

              <form className="premium-form" onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="form-section">
                  <h4>Personal Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <div className={`input-wrapper ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''}`}>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter your full name"
                        />
                        <span className="input-icon">👤</span>
                      </div>
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          placeholder="your.email@company.com"
                        />
                        <span className="input-icon">✉️</span>
                      </div>
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <div className={`input-wrapper ${focusedField === 'phone' ? 'focused' : ''} ${errors.phone ? 'error' : ''}`}>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField('')}
                          placeholder="+91 98765 43210"
                        />
                        <span className="input-icon">📞</span>
                      </div>
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label>Company Name</label>
                      <div className={`input-wrapper ${focusedField === 'company' ? 'focused' : ''}`}>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('company')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Your company name"
                        />
                        <span className="input-icon">🏢</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="form-section">
                  <h4>Your Requirements</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Category *</label>
                      <div className={`select-wrapper ${errors.category ? 'error' : ''}`}>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="">Select product category</option>
                          {productCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    <div className="form-group">
                      <label>Destination Country</label>
                      <div className={`input-wrapper ${focusedField === 'country' ? 'focused' : ''}`}>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('country')}
                          onBlur={() => setFocusedField('')}
                          placeholder="e.g., USA, UK, UAE"
                        />
                        <span className="input-icon">🌍</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Quantity Range</label>
                      <div className="select-wrapper">
                        <select
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                        >
                          <option value="">Select quantity range</option>
                          {quantityRanges.map(range => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Timeline</label>
                      <div className="select-wrapper">
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                        >
                          <option value="">Select timeline</option>
                          {timelineOptions.map(time => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="form-section">
                  <h4>Additional Information</h4>
                  <div className="form-group">
                    <label>Your Message / Requirements *</label>
                    <div className={`textarea-wrapper ${focusedField === 'message' ? 'focused' : ''} ${errors.message ? 'error' : ''}`}>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField('')}
                        rows="5"
                        placeholder="Please describe your requirements, quality standards, packaging preferences, or any specific questions..."
                      />
                    </div>
                    {errors.message && <span className="error-message">{errors.message}</span>}
                  </div>

                  <div className="form-options">
                    <div className="option-group">
                      <label>Preferred Contact Method</label>
                      <div className="radio-group">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={formData.preferredContact === 'email'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom"></span>
                          Email
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="phone"
                            checked={formData.preferredContact === 'phone'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom"></span>
                          Phone
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="whatsapp"
                            checked={formData.preferredContact === 'whatsapp'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom"></span>
                          WhatsApp
                        </label>
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="subscribe"
                          checked={formData.subscribe}
                          onChange={handleChange}
                        />
                        <span className="checkbox-custom"></span>
                        Subscribe to our newsletter for market updates and product availability
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-submit">
                  <button
                    type="submit"
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🚀</span>
                        Send Message
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="success-message">
                      <span className="success-icon">✅</span>
                      Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="error-message">
                      <span className="error-icon">❌</span>
                      Sorry, there was an error sending your message. Please try again or contact us directly.
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;