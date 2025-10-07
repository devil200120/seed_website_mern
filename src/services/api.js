import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || 
                  localStorage.getItem('vendorToken') || 
                  localStorage.getItem('customerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only set Content-Type to application/json if it's not already set (for FormData)
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorData');
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerData');
      // Don't redirect if on public pages
      if (window.location.pathname.includes('/admin/') || 
          window.location.pathname.includes('/vendor/') ||
          window.location.pathname.includes('/customer/')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Services
export const adminAPI = {
  // Check if admin signup is allowed
  checkSignupStatus: () => api.get('/admin/signup-status'),
  
  // Admin signup
  signup: (data) => api.post('/admin/signup', data),
  
  // Admin login
  login: (data) => api.post('/admin/login', data),
  
  // Get admin profile
  getProfile: () => api.get('/admin/profile'),
  
  // Update admin profile
  updateProfile: (data) => api.put('/admin/profile', data),
  
  // Change password
  changePassword: (data) => api.post('/admin/change-password', data),
  
  // Logout
  logout: () => api.post('/admin/logout')
};

export const licenseAPI = {
  // Request license key
  requestLicenseKey: (email) => api.post('/license/request', { email }),
  
  // Validate license key
  validateLicenseKey: (licenseKey, email) => 
    api.post('/license/validate', { licenseKey, email }),
  
  // Get license key status
  getLicenseKeyStatus: (email) => 
    api.get('/license/status', { params: { email } }),
  
  // Resend license key
  resendLicenseKey: (email) => api.post('/license/resend', { email })
};

export const orderAPI = {
  // Create new order
  createOrder: (orderData) => api.post('/orders/create', orderData),
  
  // Confirm order (customer)
  confirmOrder: (orderNumber, customerEmail) => 
    api.post('/orders/confirm', { orderNumber, customerEmail }),
  
  // Get all orders (admin only)
  getAllOrders: (params = {}) => api.get('/orders/all', { params }),
  
  // Get single order by ID
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  
  // Update order status
  updateOrderStatus: (orderId, data) => api.put(`/orders/${orderId}`, data),
  
  // Provide quote for order (admin only)
  provideQuote: (orderId, quoteData) => api.post(`/orders/${orderId}/quote`, quoteData),
  
  // Get order statistics
  getOrderStats: () => api.get('/orders/stats'),
  
  // Delete order
  deleteOrder: (orderId) => api.delete(`/orders/${orderId}`),

  // Generate invoice (customer access)
  generateInvoice: (orderNumber, customerEmail) => 
    api.get(`/orders/by-number/invoice?orderNumber=${orderNumber}&customerEmail=${customerEmail}`),

  // Generate invoice (admin access)
  generateAdminInvoice: (orderId) => api.get(`/orders/${orderId}/admin-invoice`)
};

export const vendorAPI = {
  // Vendor registration
  register: (vendorData) => api.post('/vendors/register', vendorData),
  
  // Vendor login
  login: (credentials) => api.post('/vendors/login', credentials),
  
  // Get vendor profile
  getProfile: () => api.get('/vendors/profile'),
  
  // Update vendor profile
  updateProfile: (data) => api.put('/vendors/profile', data),
  
  // Get all vendors (Admin only)
  getAllVendors: (params = {}) => api.get('/vendors', { params }),
  
  // Update vendor status (Admin only)
  updateVendorStatus: (vendorId, status) => 
    api.put(`/vendors/${vendorId}/status`, { status })
};

export const productAPI = {
  // Get all products (public)
  getAllProducts: (params = {}) => api.get('/products', { params }),
  
  // Get featured products (public)
  getFeaturedProducts: (limit = 6) => api.get(`/products/featured?limit=${limit}`),
  
  // Get product by ID (public)
  getProductById: (productId) => api.get(`/products/${productId}`),
  
  // Get product categories (public)
  getProductCategories: () => api.get('/products/categories'),
  
  // Get vendor's products (vendor only)
  getVendorProducts: (params = {}) => api.get('/products/vendor/my-products', { params }),
  
  // Create product (vendor only)
  createProduct: (formData) => {
    return api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Update product (vendor only)
  updateProduct: (productId, formData) => {
    return api.put(`/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Delete product (vendor only)
  deleteProduct: (productId) => api.delete(`/products/${productId}`)
};

export const customerAPI = {
  // Customer registration
  register: (customerData) => api.post('/customers/register', customerData),
  
  // Customer login
  login: (credentials) => api.post('/customers/login', credentials),
  
  // Verify customer email
  verifyEmail: (token) => api.get(`/customers/verify/${token}`),
  
  // Get customer profile
  getProfile: () => api.get('/customers/profile'),
  
  // Update customer profile
  updateProfile: (data) => api.put('/customers/profile', data),
  
  // Forgot password
  forgotPassword: (email) => api.post('/customers/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, password) => api.post(`/customers/reset-password/${token}`, { password }),
  
  // Get all customers (Admin only)
  getAllCustomers: (params = {}) => api.get('/customers', { params }),
  
  // Update customer status (Admin only)
  updateCustomerStatus: (customerId, status) => 
    api.put(`/customers/${customerId}/status`, { status }),
  
  // Delete customer (Admin only)
  deleteCustomer: (customerId) => api.delete(`/customers/${customerId}`)
};

// Auth helper functions
export const authUtils = {
  // Set authentication data
  setAuth: (token, adminData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  },
  
  // Set vendor authentication data
  setVendorAuth: (token, vendorData) => {
    localStorage.setItem('vendorToken', token);
    localStorage.setItem('vendorData', JSON.stringify(vendorData));
  },
  
  // Set customer authentication data
  setCustomerAuth: (token, customerData) => {
    localStorage.setItem('customerToken', token);
    localStorage.setItem('customerData', JSON.stringify(customerData));
  },
  
  // Get authentication data
  getAuth: () => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    return {
      token,
      admin: adminData ? JSON.parse(adminData) : null
    };
  },
  
  // Get vendor authentication data
  getVendorAuth: () => {
    const token = localStorage.getItem('vendorToken');
    const vendorData = localStorage.getItem('vendorData');
    return {
      token,
      vendor: vendorData ? JSON.parse(vendorData) : null
    };
  },
  
  // Get customer authentication data
  getCustomerAuth: () => {
    const token = localStorage.getItem('customerToken');
    const customerData = localStorage.getItem('customerData');
    return {
      token,
      customer: customerData ? JSON.parse(customerData) : null
    };
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  },
  
  // Check if vendor is authenticated
  isVendorAuthenticated: () => {
    const token = localStorage.getItem('vendorToken');
    return !!token;
  },
  
  // Check if customer is authenticated
  isCustomerAuthenticated: () => {
    const token = localStorage.getItem('customerToken');
    return !!token;
  },
  
  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },
  
  // Clear vendor authentication data
  clearVendorAuth: () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
  },
  
  // Clear customer authentication data
  clearCustomerAuth: () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
  },
  
  // Clear all authentication data
  clearAllAuth: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
  }
};

export default api;