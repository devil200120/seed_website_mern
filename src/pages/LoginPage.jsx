import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Demo admin credentials - replace with real authentication
      const adminCredentials = {
        email: 'admin@fieldtofeedexport.com',
        password: 'admin123'
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (
        formData.email === adminCredentials.email && 
        formData.password === adminCredentials.password
      ) {
        // Set admin session
        localStorage.setItem('adminToken', 'demo-admin-token-' + Date.now());
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', formData.email);
        
        // Redirect to admin panel
        navigate('/admin');
      } else {
        setError('Invalid email or password. Use admin@fieldtofeedexport.com / admin123');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate('/');
  };

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

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <h4>Demo Admin Credentials:</h4>
            <p><strong>Email:</strong> admin@fieldtofeedexport.com</p>
            <p><strong>Password:</strong> admin123</p>
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