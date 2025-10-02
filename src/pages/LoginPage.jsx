import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, authUtils } from "../services/api";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if admin exists on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setInitialLoading(true);
        const response = await adminAPI.checkSignupStatus();
        const signupAllowed = response.data.data.signupAllowed;

        if (signupAllowed) {
          // No admin exists, redirect to signup
          navigate("/admin/signup");
        }
        // If admin exists, component will continue to render login form
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setError("Failed to check system status. Please refresh the page.");
        // Allow login attempt in case of error
      } finally {
        setInitialLoading(false);
      }
    };

    // Check if user is already authenticated
    if (authUtils.isAuthenticated()) {
      navigate("/admin/dashboard");
      return;
    }

    checkAdminStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password.");
        return;
      }

      // Make API call to login
      const response = await adminAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // Store auth data
      authUtils.setAuth(response.data.data.token, response.data.data.admin);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (error.response?.status === 423) {
        setError(
          "Account is temporarily locked due to multiple failed login attempts. Please try again later."
        );
      } else {
        setError(
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate("/");
  };

  // Show loading state while checking admin status
  if (initialLoading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="company-logo">
              <h1>🌱</h1>
              <h2>Field to Feed Export</h2>
              <p>Checking system status...</p>
            </div>
          </div>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="company-logo">
            <h1>🌱</h1>
            <h2>Field to Feed Export</h2>
            <p>Admin Panel Login</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>

        <div className="login-footer">
          <div className="signup-link">
            <p>
              Need to set up admin account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => navigate("/admin/signup")}
              >
                Create Admin Account
              </button>
            </p>
          </div>

          <button onClick={goHome} className="back-home-btn">
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
