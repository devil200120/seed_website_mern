import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { vendorAPI, authUtils } from "../services/api";
import "./VendorLogin.css";

function VendorLogin() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
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

  // Set the correct tab based on URL
  useEffect(() => {
    if (location.pathname === "/vendor/register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await vendorAPI.login(loginForm);

      if (response.data.success) {
        // Store vendor auth data
        authUtils.setVendorAuth(
          response.data.data.token,
          response.data.data.vendor
        );

        // Redirect to vendor dashboard
        window.location.href = "/vendor/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await vendorAPI.register(registerForm);

      if (response.data.success) {
        setSuccess(
          "Registration successful! Your account is pending approval. You will be notified once approved."
        );
        setIsLogin(true);
        // Reset form
        setRegisterForm({
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
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationChange = (specialization) => {
    const updatedSpecializations = registerForm.specializations.includes(
      specialization
    )
      ? registerForm.specializations.filter((s) => s !== specialization)
      : [...registerForm.specializations, specialization];

    setRegisterForm({
      ...registerForm,
      specializations: updatedSpecializations,
    });
  };

  return (
    <div className="vendor-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Vendor {isLogin ? "Login" : "Registration"}</h1>
          <p>
            {isLogin
              ? "Access your vendor dashboard to manage products and orders"
              : "Join our platform as a vendor and start selling your products"}
          </p>
        </div>

        <div className="form-tabs">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {isLogin ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="register-form">
            <div className="form-section">
              <h3>Business Information</h3>

              <div className="form-group">
                <label>Business Name *</label>
                <input
                  type="text"
                  required
                  value={registerForm.businessName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
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
                    value={registerForm.contactPerson.firstName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        contactPerson: {
                          ...registerForm.contactPerson,
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
                    value={registerForm.contactPerson.lastName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        contactPerson: {
                          ...registerForm.contactPerson,
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
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
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
                    value={registerForm.phone}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
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
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
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
                  value={registerForm.businessType}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
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
              <h3>Address Information</h3>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  required
                  value={registerForm.address.street}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      address: {
                        ...registerForm.address,
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
                    value={registerForm.address.city}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        address: {
                          ...registerForm.address,
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
                    value={registerForm.address.state}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        address: {
                          ...registerForm.address,
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
                    value={registerForm.address.country}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        address: {
                          ...registerForm.address,
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
                    value={registerForm.address.zipCode}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        address: {
                          ...registerForm.address,
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
              <h3>Specializations *</h3>
              <p className="form-helper">
                Select the product categories you specialize in:
              </p>

              <div className="specializations-grid">
                {specializations.map((spec) => (
                  <label key={spec} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={registerForm.specializations.includes(spec)}
                      onChange={() => handleSpecializationChange(spec)}
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>

              {registerForm.specializations.length === 0 && (
                <p className="error-text">
                  Please select at least one specialization
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || registerForm.specializations.length === 0}
              className="submit-btn"
            >
              {loading ? "Registering..." : "Register as Vendor"}
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin;
