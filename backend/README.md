# 🌱 Seed Website MERN - Admin License System

A complete admin authentication system with license key validation for the Seed Website MERN application.

## 🚀 Features

### Admin License System
- **One-time Admin Setup**: Only one admin account can be created
- **License Key Validation**: Email-based license key system
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Email Integration**: Automated license key delivery via email
- **Account Security**: Login attempt limiting and account locking

### Modern Admin Dashboard
- **Unacademy-style Design**: Modern, vibrant UI with gradients and animations
- **Responsive Layout**: Mobile-first design approach
- **Real-time Analytics**: Dashboard with stats and insights
- **Order Management**: Complete order tracking and management
- **Interactive Components**: Smooth animations and hover effects

## 📋 Prerequisites

- **Node.js**: v16 or higher
- **MongoDB**: v4.4 or higher
- **Email Account**: Gmail or other SMTP service for sending license keys

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run backend:install

# Or install both at once
npm run setup
```

### 2. Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/seed_website_db

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin License Configuration
MASTER_LICENSE_KEY=SEED-ADMIN-2024-MASTER-KEY
LICENSE_EXPIRY_HOURS=24

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
```

### 3. Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
   - Use this password in `EMAIL_PASS`

### 4. MongoDB Setup

```bash
# Install MongoDB (if not already installed)
# On macOS:
brew install mongodb-community

# On Ubuntu:
sudo apt-get install mongodb

# Start MongoDB service
# On macOS:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod
```

### 5. Frontend Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode

```bash
# Run both frontend and backend
npm run dev:full

# Or run separately:
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run dev
```

### Production Mode

```bash
# Build frontend
npm run build

# Start backend
npm run backend:start
```

## 🔐 Admin Setup Flow

### 1. Initial Setup
1. Navigate to `/admin/signup`
2. System checks if admin already exists
3. If no admin exists, proceed to license request

### 2. License Key Request
1. Enter email address
2. Click "Send License Key"
3. System generates unique license key
4. License key is sent via email
5. Key expires in 24 hours

### 3. Admin Registration
1. Enter email, name, and password
2. Paste the license key from email
3. Submit registration form
4. Admin account is created
5. Automatic login and redirect to dashboard

### 4. Security Features
- Only one admin account allowed
- License keys expire after 24 hours
- Failed login attempts result in account locking
- Passwords are hashed with bcrypt
- JWT tokens for secure authentication

## 📊 API Endpoints

### Admin Routes (`/api/admin`)
- `GET /signup-status` - Check if signup is allowed
- `POST /signup` - Create admin account
- `POST /login` - Admin login
- `GET /profile` - Get admin profile (protected)
- `PUT /profile` - Update admin profile (protected)
- `POST /change-password` - Change password (protected)
- `POST /logout` - Admin logout (protected)

### License Routes (`/api/license`)
- `POST /request` - Request license key
- `POST /validate` - Validate license key
- `GET /status` - Get license key status
- `POST /resend` - Resend license key

## 🎨 UI Components

### Admin Signup Page
- **Step 1**: System status check
- **Step 2**: License key request form
- **Step 3**: Admin registration form
- **Features**: 
  - Real-time validation
  - Error handling
  - Success feedback
  - Responsive design

### Admin Dashboard
- **Modern Design**: Unacademy-style interface
- **Sidebar Navigation**: Collapsible with smooth animations
- **Dashboard Cards**: Interactive stats with gradients
- **Charts**: Placeholder visualizations for future data
- **Orders Management**: Complete table with filtering and pagination

## 🔧 Database Models

### Admin Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (super_admin/admin),
  licenseKey: String (unique),
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### License Key Model
```javascript
{
  key: String (unique),
  email: String,
  status: String (pending/sent/used/expired),
  generatedAt: Date,
  sentAt: Date,
  usedAt: Date,
  expiresAt: Date,
  usedBy: ObjectId (Admin),
  attempts: Number,
  metadata: {
    ip: String,
    userAgent: String,
    requestedAt: Date
  }
}
```

## 🛡️ Security Features

1. **Password Security**
   - Minimum 8 characters
   - Must include uppercase, lowercase, number, and special character
   - Bcrypt hashing with configurable rounds

2. **Account Protection**
   - Maximum 5 login attempts
   - Account locked for 2 hours after failed attempts
   - Automatic unlock after lockout period

3. **License Key Security**
   - Unique keys with expiration
   - Email validation
   - One-time use only
   - Automatic cleanup of expired keys

4. **JWT Security**
   - Secure token generation
   - Configurable expiration
   - Automatic token validation

## 🎯 Usage Examples

### Request License Key
```javascript
const response = await licenseAPI.requestLicenseKey('admin@example.com');
console.log(response.data.message); // "License key sent successfully"
```

### Admin Signup
```javascript
const signupData = {
  email: 'admin@example.com',
  name: 'John Admin',
  password: 'SecurePass123!',
  licenseKey: 'SEED-A1B2-C3D4-E5F6-G7H8'
};

const response = await adminAPI.signup(signupData);
console.log(response.data.data.admin); // Admin details
```

### Admin Login
```javascript
const loginData = {
  email: 'admin@example.com',
  password: 'SecurePass123!'
};

const response = await adminAPI.login(loginData);
const { token, admin } = response.data.data;

// Store authentication data
authUtils.setAuth(token, admin);
```

## 🚨 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Gmail app password
   - Verify EMAIL_USER and EMAIL_PASS in .env
   - Ensure 2FA is enabled on Gmail

2. **MongoDB connection failed**
   - Start MongoDB service
   - Check MONGODB_URI in .env
   - Verify MongoDB is running on correct port

3. **License key not working**
   - Check if key has expired (24 hours)
   - Verify email matches the one used for request
   - Ensure key format is correct

4. **Admin signup blocked**
   - Only one admin account allowed
   - Delete existing admin from database to reset
   - Check signup status endpoint

### Reset Admin Account

To reset and allow new admin signup:

```javascript
// Connect to MongoDB and delete existing admin
db.admins.deleteMany({});
db.licensekeys.deleteMany({});
```

## 📱 Mobile Responsiveness

The admin interface is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface elements
- Optimized layouts for tablets and phones
- Accessible navigation patterns

## 🔮 Future Enhancements

- [ ] Multi-admin support with role-based permissions
- [ ] Admin invitation system
- [ ] Advanced analytics and reporting
- [ ] Real-time notifications
- [ ] Audit logging
- [ ] Advanced security features (2FA, SSO)
- [ ] Mobile app for admin management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@seedwebsite.com
- Documentation: [docs.seedwebsite.com](https://docs.seedwebsite.com)

---

**Built with ❤️ for the Seed Website community**