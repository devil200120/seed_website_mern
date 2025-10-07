import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./VendorRegister.css";

function VendorRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    businessType: "",
    registrationNumber: "",
    taxId: "",
    yearEstablished: "",
    
    // Contact Person
    contactPersonName: "",
    contactPersonTitle: "",
    email: "",
    phone: "",
    alternatePhone: "",
    
    // Login Credentials
    password: "",
    confirmPassword: "",
    
    // Business Address
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    
    // Product Information
    productCategories: [],
    productsDescription: "",
    monthlyCapacity: "",
    
    // Additional Information
    website: "",
    certifications: "",
    exportExperience: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const businessTypes = [
    "Manufacturer",
    "Distributor",
    "Wholesaler",
    "Farmer/Producer",
    "Cooperative",
    "Trading Company",
    "Other"
  ];

  const productCategoryOptions = [
    "Fresh Vegetables",
    "Fresh Fruits",
    "Spices & Herbs",
    "Grains & Cereals",
    "Pulses & Legumes",
    "Dairy Products",
    "Processed Foods",
    "Organic Products",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      productCategories: checked
        ? [...prev.productCategories, value]
        : prev.productCategories.filter((cat) => cat !== value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Business Information validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Please select a business type";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    // Contact Person validation
    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = "Contact person name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Address validation
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Product Categories validation
    if (formData.productCategories.length === 0) {
      newErrors.productCategories = "Please select at least one product category";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = document.querySelector('.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/vendor/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Vendor Registration Data:", formData);

      // Show success message and redirect
      alert("Registration successful! Your vendor account is pending approval. You will receive an email once approved.");
      navigate("/vendor/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vendor-register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="header-icon">🏪</div>
          <h1>Vendor Registration</h1>
          <p>Join our network of trusted suppliers and expand your business globally</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Business Information Section */}
          <div className="form-section">
            <h2 className="section-title">📋 Business Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessName">
                  Business Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className={errors.businessName ? "error" : ""}
                />
                {errors.businessName && (
                  <span className="error-message">{errors.businessName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="businessType">
                  Business Type <span className="required">*</span>
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className={errors.businessType ? "error" : ""}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.businessType && (
                  <span className="error-message">{errors.businessType}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registrationNumber">
                  Business Registration Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g., 123456789"
                  className={errors.registrationNumber ? "error" : ""}
                />
                {errors.registrationNumber && (
                  <span className="error-message">{errors.registrationNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="taxId">Tax ID / VAT Number (Optional)</label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  placeholder="Tax identification number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="yearEstablished">Year Established (Optional)</label>
                <input
                  type="number"
                  id="yearEstablished"
                  name="yearEstablished"
                  value={formData.yearEstablished}
                  onChange={handleChange}
                  placeholder="e.g., 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website (Optional)</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Person Section */}
          <div className="form-section">
            <h2 className="section-title">👤 Contact Person Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPersonName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactPersonName"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  placeholder="Contact person's full name"
                  className={errors.contactPersonName ? "error" : ""}
                />
                {errors.contactPersonName && (
                  <span className="error-message">{errors.contactPersonName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contactPersonTitle">Job Title (Optional)</label>
                <input
                  type="text"
                  id="contactPersonTitle"
                  name="contactPersonTitle"
                  value={formData.contactPersonTitle}
                  onChange={handleChange}
                  placeholder="e.g., CEO, Manager, Director"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="business@example.com"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="alternatePhone">Alternate Phone (Optional)</label>
              <input
                type="tel"
                id="alternatePhone"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="Secondary contact number"
              />
            </div>
          </div>

          {/* Login Credentials Section */}
          <div className="form-section">
            <h2 className="section-title">🔐 Login Credentials</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={errors.password ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>
          </div>

          {/* Business Address Section */}
          <div className="form-section">
            <h2 className="section-title">📍 Business Address</h2>
            
            <div className="form-group">
              <label htmlFor="streetAddress">
                Street Address <span className="required">*</span>
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Building number, street name"
                className={errors.streetAddress ? "error" : ""}
              />
              {errors.streetAddress && (
                <span className="error-message">{errors.streetAddress}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={errors.city ? "error" : ""}
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state">State/Province (Optional)</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">
                  Country <span className="required">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={errors.country ? "error" : ""}
                >
                  <option value="">Select country</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Japan">Japan</option>
                  <option value="Other">Other</option>
                </select>
                {errors.country && (
                  <span className="error-message">{errors.country}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP/Postal Code (Optional)</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="form-section">
            <h2 className="section-title">📦 Product Information</h2>
            
            <div className="form-group">
              <label>
                Product Categories <span className="required">*</span>
              </label>
              <div className="checkbox-group">
                {productCategoryOptions.map((category) => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={category}
                      checked={formData.productCategories.includes(category)}
                      onChange={handleCategoryChange}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
              {errors.productCategories && (
                <span className="error-message">{errors.productCategories}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="productsDescription">Products Description (Optional)</label>
              <textarea
                id="productsDescription"
                name="productsDescription"
                value={formData.productsDescription}
                onChange={handleChange}
                placeholder="Describe your products, specialties, and unique offerings..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="monthlyCapacity">Monthly Production Capacity (Optional)</label>
                <input
                  type="text"
                  id="monthlyCapacity"
                  name="monthlyCapacity"
                  value={formData.monthlyCapacity}
                  onChange={handleChange}
                  placeholder="e.g., 1000 tons, 50000 units"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exportExperience">Export Experience (Optional)</label>
                <select
                  id="exportExperience"
                  name="exportExperience"
                  value={formData.exportExperience}
                  onChange={handleChange}
                >
                  <option value="">Select experience level</option>
                  <option value="no-experience">No Experience</option>
                  <option value="less-than-1-year">Less than 1 year</option>
                  <option value="1-3-years">1-3 years</option>
                  <option value="3-5-years">3-5 years</option>
                  <option value="5-plus-years">5+ years</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="certifications">Certifications (Optional)</label>
              <input
                type="text"
                id="certifications"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="e.g., ISO 9001, HACCP, Organic, Fair Trade"
              />
              <small className="form-hint">List any quality or safety certifications (comma-separated)</small>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="submit-error">{errors.submit}</div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Submitting Application...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Submit Vendor Application
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="form-footer">
            <p>
              Already have a vendor account?{" "}
              <Link to="/vendor/login" className="login-link">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VendorRegister;
