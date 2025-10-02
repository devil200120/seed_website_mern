# Seed Website MERN Stack Application

A full-stack web application for Field to Feed Export business with secure admin panel and license-based authentication system.

## 🌟 Features

### Frontend (React + Vite)
- Modern React application with responsive design
- Multi-page website with product showcase
- Secure admin panel with protected routes
- Real-time license key validation
- Professional UI/UX with smooth animations

### Backend (Node.js + Express + MongoDB)
- RESTful API with comprehensive error handling
- JWT-based authentication system
- License key generation and email delivery
- MongoDB integration with Mongoose ODM
- Rate limiting and security middleware
- Email service integration

### Admin Authentication Flow
1. **Single Admin Restriction**: Only one admin account can be created
2. **License Key Request**: Admin requests license key via email
3. **Email Delivery**: System sends unique license key to provided email
4. **License Validation**: Real-time validation before signup
5. **Account Creation**: Secure admin account creation with license verification
6. **Auto-Redirect**: Automatic redirection based on admin existence

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)
- Email service (Gmail recommended)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/seed_website_db
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to root directory**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📋 Admin Authentication Process

### For First-Time Setup:

1. **Visit Admin Login**: Navigate to `/admin/login`
2. **Auto-Redirect**: System checks if admin exists, redirects to signup if none
3. **Request License**: Enter email address to request license key
4. **Check Email**: Receive license key via email (valid for 24 hours)
5. **Complete Signup**: Use license key to create admin account
6. **Dashboard Access**: Login to access admin dashboard

### For Subsequent Logins:

1. **Visit Admin Login**: Navigate to `/admin/login`
2. **Enter Credentials**: Use email and password
3. **Dashboard Access**: Direct access to admin panel

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation middleware
- **Account Locking**: Temporary lockout after failed attempts
- **License Expiry**: Time-limited license keys
- **Single Admin Policy**: Prevents multiple admin accounts

## 📁 Project Structure

```
seed_website_mern/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── licenseController.js
│   ├── models/
│   │   ├── Admin.js
│   │   └── LicenseKey.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   └── licenseRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── cryptoUtils.js
│   │   └── emailService.js
│   └── server.js
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── AdminSignup.jsx
│   │   ├── LoginPage.jsx
│   │   └── AdminPanel.jsx
│   ├── services/
│   │   └── api.js
│   └── App.jsx
└── README.md
```

## 🔧 API Endpoints

### Admin Routes
- `GET /api/admin/signup-status` - Check if admin signup is allowed
- `POST /api/admin/signup` - Create admin account
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (protected)

### License Routes  
- `POST /api/license/request` - Request license key
- `POST /api/license/validate` - Validate license key
- `GET /api/license/status` - Get license status
- `POST /api/license/resend` - Resend license key

## 🎯 Key Features Explained

### License Key System
- Unique format: `SEED-XXXX-XXXX-XXXX-XXXX`
- 24-hour expiration period
- Single-use validation
- Email delivery with HTML templates

### Admin Account Management
- One-time setup process
- Secure password requirements
- Account lockout protection
- JWT-based session management

### Real-time Validation
- Live license key validation
- Instant feedback to users
- Debounced API calls
- Loading states and error handling

## 🛠 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
```

### Frontend Development
```bash
npm run dev  # Start Vite dev server
```

### Production Build
```bash
npm run build  # Build for production
```

## 📧 Email Configuration

For Gmail setup:
1. Enable 2-factor authentication
2. Generate app-specific password
3. Use app password in EMAIL_PASS environment variable

## 🔍 Troubleshooting

### Common Issues:

1. **MongoDB Connection**: Ensure MongoDB is running
2. **Email Delivery**: Check email service configuration
3. **Port Conflicts**: Ensure ports 5000 and 5173 are available
4. **License Key Format**: Must match exact pattern

### Environment Variables:
- All required environment variables must be set
- JWT_SECRET should be a strong, random string
- EMAIL credentials must be valid

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.
