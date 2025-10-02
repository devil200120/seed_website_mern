import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, licenseAPI, authUtils } from "../services/api";
import "./AdminSignup.css";

function AdminSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Check status, 2: Request license, 3: Signup form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseValidation, setLicenseValidation] = useState({
    isValidating: false,
    isValid: null,
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  // Check signup status on component mount
  useEffect(() => {
    const checkSignupStatus = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.checkSignupStatus();

        if (!response.data.data.signupAllowed) {
          setError("Admin account already exists. Signup is not allowed.");
          setTimeout(() => {
            navigate("/admin/login");
          }, 3000);
        } else {
          setStep(2);
        }
      } catch (error) {
        console.error("Signup status check failed:", error);
        setError("Failed to check signup status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkSignupStatus();
  }, [navigate]);

  const handleRequestLicense = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await licenseAPI.requestLicenseKey(email);
      setSuccess("License key sent to your email! Please check your inbox.");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send license key. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!licenseKey.trim()) {
      setError("License key is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // First validate the license key
      await licenseAPI.validateLicenseKey(licenseKey.trim(), email);

      const signupData = {
        email,
        name: formData.name.trim(),
        password: formData.password,
        licenseKey: licenseKey.trim(),
      };

      const response = await adminAPI.signup(signupData);

      // Store auth data
      authUtils.setAuth(response.data.data.token, response.data.data.admin);

      setSuccess("Admin account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create admin account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendLicense = async () => {
    try {
      setLoading(true);
      setError("");

      await licenseAPI.resendLicenseKey(email);
      setSuccess("License key resent! Please check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend license key.");
    } finally {
      setLoading(false);
    }
  };

  const validateLicenseKeyInput = async (key, emailValue) => {
    if (!key || key.length < 10) {
      setLicenseValidation({
        isValidating: false,
        isValid: null,
        message: "",
      });
      return;
    }

    try {
      setLicenseValidation({
        isValidating: true,
        isValid: null,
        message: "Validating license key...",
      });

      await licenseAPI.validateLicenseKey(key, emailValue);

      setLicenseValidation({
        isValidating: false,
        isValid: true,
        message: "✅ License key is valid",
      });
    } catch (err) {
      setLicenseValidation({
        isValidating: false,
        isValid: false,
        message: err.response?.data?.message || "Invalid license key",
      });
    }
  };

  const handleLicenseKeyChange = (e) => {
    const key = e.target.value;
    setLicenseKey(key);

    // Debounce license key validation
    clearTimeout(window.licenseValidationTimeout);
    window.licenseValidationTimeout = setTimeout(() => {
      if (email && key) {
        validateLicenseKeyInput(key, email);
      }
    }, 500);
  };

  if (step === 1) {
    return (
      <div className="admin-signup">
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <h1>🌱 Admin Setup</h1>
              <p>Checking system status...</p>
            </div>

            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Please wait...</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="admin-signup">
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <h1>🔐 Request License Key</h1>
              <p>Enter your email to receive an admin license key</p>
            </div>

            <form onSubmit={handleRequestLicense} className="signup-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">❌</span>
                  {error}
                </div>
              )}

              {success && (
                <div className="success-message">
                  <span className="success-icon">✅</span>
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="signup-btn primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Sending...
                  </>
                ) : (
                  "Send License Key"
                )}
              </button>

              <div className="form-footer">
                <p>
                  Already have a license key?{" "}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setStep(3)}
                  >
                    Continue to signup
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-signup">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>👤 Create Admin Account</h1>
            <p>Complete your admin registration</p>
          </div>

          <form onSubmit={handleSignup} className="signup-form">
            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Create a strong password"
                required
                disabled={loading}
                minLength={8}
              />
              <small className="form-hint">
                At least 8 characters with uppercase, lowercase, number, and
                special character
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="licenseKey">License Key</label>
              <input
                type="text"
                id="licenseKey"
                value={licenseKey}
                onChange={handleLicenseKeyChange}
                placeholder="SEED-XXXX-XXXX-XXXX-XXXX"
                required
                disabled={loading}
              />
              {licenseValidation.isValidating && (
                <small className="form-hint" style={{ color: "#3b82f6" }}>
                  <span
                    className="spinner-small"
                    style={{
                      width: "12px",
                      height: "12px",
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  ></span>
                  {licenseValidation.message}
                </small>
              )}
              {!licenseValidation.isValidating &&
                licenseValidation.isValid === true && (
                  <small className="form-hint" style={{ color: "#16a34a" }}>
                    {licenseValidation.message}
                  </small>
                )}
              {!licenseValidation.isValidating &&
                licenseValidation.isValid === false && (
                  <small className="form-hint" style={{ color: "#dc2626" }}>
                    ❌ {licenseValidation.message}
                  </small>
                )}
              {!licenseValidation.message && (
                <small className="form-hint">
                  Check your email for the license key.{" "}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={handleResendLicense}
                    disabled={loading}
                  >
                    Resend?
                  </button>
                </small>
              )}
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {success}
              </div>
            )}

            <button
              type="submit"
              className="signup-btn primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>

            <div className="form-footer">
              <p>
                Need a new license key?{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setStep(2);
                    setEmail("");
                    setLicenseKey("");
                  }}
                >
                  Request new key
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
