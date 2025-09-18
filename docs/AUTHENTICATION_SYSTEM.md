# Authentication System Documentation

## Overview

The Bandsyte authentication system provides a secure, enterprise-grade authentication experience with token-based authentication, session management, and comprehensive security features for band website management.

## 🔐 **Core Features**

### **Token-Based Authentication**

- **Access Tokens**: Short-lived (1 hour) JWT tokens for API access
- **Refresh Tokens**: Long-lived (7 days) tokens stored securely in Redis
- **Automatic Refresh**: Seamless token renewal without user intervention

### **Security Features**

- **Session Tracking**: Monitor user sessions with IP address and user agent
- **Token Reuse Detection**: Automatically detects and prevents token theft
- **Rate Limiting**: Protects against brute force attacks
- **CSRF Protection**: Prevents cross-site request forgery attacks
- **Secure Cookies**: HttpOnly, Secure, SameSite flags configured

### **User Management**

- **Role-Based Access**: USER, ADMIN, SUPERADMIN roles
- **Email Verification**: Secure email verification with signed tokens
- **Password Reset**: Secure password reset with time-limited tokens
- **Account Status**: ACTIVE/INACTIVE status management

## 🚀 **How It Works**

### **1. Login Flow**

```
User Login → Validate Credentials → Generate Tokens → Set Cookies → Return User Data
```

1. User submits email/password
2. System validates credentials against database
3. If valid, generates access token (1 hour) and refresh token (7 days)
4. Tokens stored in secure HTTP-only cookies
5. Session created with IP and user agent tracking
6. Returns user data to client

### **2. Authentication Flow**

```
Request → Check Access Token → If Expired → Use Refresh Token → Continue
```

1. Client makes authenticated request
2. Middleware checks for valid access token
3. If token expired, automatically uses refresh token
4. If refresh successful, new tokens issued
5. Request continues with valid authentication

### **3. Token Refresh Flow**

```
Refresh Request → Validate Refresh Token → Check Redis → Generate New Tokens
```

1. Client requests token refresh
2. System validates refresh token against Redis storage
3. Checks IP and user agent for security
4. If valid, generates new access and refresh tokens
5. Updates cookies and Redis storage

## 📡 **API Endpoints**

### **Authentication Endpoints**

| Endpoint            | Method | Description       | Auth Required |
| ------------------- | ------ | ----------------- | ------------- |
| `/api/auth/login`   | POST   | User login        | No            |
| `/api/auth/signup`  | POST   | User registration | No            |
| `/api/auth/logout`  | POST   | User logout       | Yes           |
| `/api/auth/refresh` | POST   | Refresh tokens    | No            |
| `/api/auth/me`      | GET    | Check auth status | Yes           |

### **Email Verification**

| Endpoint                        | Method | Description               | Auth Required |
| ------------------------------- | ------ | ------------------------- | ------------- |
| `/api/auth/verify-email`        | GET    | Verify email with token   | No            |
| `/api/auth/resend-verification` | POST   | Resend verification email | No            |

### **Password Reset**

| Endpoint                    | Method | Description               | Auth Required |
| --------------------------- | ------ | ------------------------- | ------------- |
| `/api/auth/forgot-password` | POST   | Request password reset    | No            |
| `/api/auth/reset-password`  | POST   | Reset password with token | No            |

### **User Management**

| Endpoint       | Method | Description         | Auth Required |
| -------------- | ------ | ------------------- | ------------- |
| `/api/user/me` | GET    | Get current user    | Yes           |
| `/api/user/me` | PUT    | Update current user | Yes           |

## 🔧 **Usage Examples**

### **Frontend Authentication**

```javascript
import { login, checkAuth, logout } from '../services/authService';

// Login
const handleLogin = async credentials => {
  try {
    const result = await login(credentials);
    if (result.success) {
      // User is now authenticated
      console.log('Login successful:', result.data.user);
    }
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Check authentication status
const checkAuthentication = async () => {
  try {
    const result = await checkAuth();
    if (result.success) {
      // User is authenticated
      return result.data.user;
    }
  } catch (error) {
    // User is not authenticated
    return null;
  }
};

// Logout
const handleLogout = async () => {
  try {
    await logout();
    // User is now logged out
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
};
```

### **Protected Routes**

```javascript
// Using requireAuth middleware
const { requireAuth } = require('../middleware/auth');

// Protected route
app.get('/api/protected', requireAuth, (req, res) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});
```

### **Role-Based Access**

```javascript
// Check user role in middleware or controller
const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

// Use in routes
app.get(
  '/api/admin/users',
  requireAuth,
  checkAdminRole,
  adminController.getUsers
);
```

## 🛡️ **Security Features**

### **Rate Limiting**

- **Login**: 5 attempts per 10 minutes
- **Password Reset**: 3 attempts per hour
- **General Auth**: 10 requests per 5 minutes
- **Admin Routes**: 20 requests per minute

### **Token Security**

- **Access Tokens**: 1-hour expiration
- **Refresh Tokens**: 7-day expiration with Redis storage
- **Token Reuse Detection**: Automatically revokes all sessions if reuse detected
- **Device Tracking**: Monitors IP and user agent changes

### **Password Security**

- **Hashing**: bcrypt with 12 salt rounds
- **Validation**: Minimum 8 characters with complexity requirements
- **Reset Tokens**: 1-hour expiration with HMAC signatures

### **Cookie Security**

```javascript
const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks
  sameSite: 'strict', // Prevents CSRF attacks
  secure: true, // HTTPS only in production
  maxAge: 3600000, // 1 hour expiration
};
```

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Required
JWT_SECRET=your-jwt-secret-key
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ENCRYPTION_KEY=your-encryption-key

# Optional
REDIS_URL=redis://localhost:6379
CSRF_SECRET=your-csrf-secret
```

### **Database Models**

#### **User Model**

```javascript
{
  adminEmail: String,         // Required, unique
  password: String,           // Required, hashed
  role: 'USER' | 'ADMIN' | 'SUPERADMIN',
  status: 'ACTIVE' | 'INACTIVE',
  verified: Boolean,
  // ... additional fields
}
```

#### **Session Model**

```javascript
{
  userId: ObjectId,           // Reference to User
  sessionId: String,          // Unique session identifier
  ipAddress: String,          // Client IP address
  userAgent: String,          // Client user agent
  expiresAt: Date,            // Session expiration
  isActive: Boolean,          // Session status
  // ... timestamps
}
```

## 🚨 **Error Handling**

### **Common Error Responses**

```javascript
// Authentication failed
{
  "success": false,
  "message": "Invalid credentials"
}

// Token expired
{
  "success": false,
  "message": "Token expired. Please log in again."
}

// Rate limit exceeded
{
  "success": false,
  "message": "Too many requests. Please try again later."
}

// Insufficient permissions
{
  "success": false,
  "message": "Admin access required"
}
```

### **Error Codes**

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🔄 **Migration & Backward Compatibility**

### **Legacy Support**

The system maintains backward compatibility with the old authentication endpoints:

- `/api/login` → `/api/auth/login`
- `/api/me` → `/api/auth/me`
- `/api/logout` → `/api/auth/logout`

### **Database Migration**

Run the migration script to update existing users:

```bash
node scripts/authMigration.js
```

## 📊 **Monitoring & Logging**

### **Security Events**

- Failed login attempts
- Token reuse detection
- Suspicious IP changes
- Rate limit violations
- Session creation/termination

### **Performance Metrics**

- Authentication response times
- Token refresh frequency
- Session duration statistics
- Error rates by endpoint

## 🔧 **Troubleshooting**

### **Common Issues**

1. **"Token expired" errors**

   - Check if refresh token is valid
   - Verify Redis connection
   - Check token expiration settings

2. **"Rate limit exceeded" errors**

   - Wait for rate limit window to reset
   - Check rate limiting configuration
   - Verify client IP detection

3. **"CSRF token missing" errors**
   - Ensure CSRF token is included in requests
   - Check CSRF configuration
   - Verify same-site cookie settings

### **Debug Mode**

Enable debug logging by setting:

```bash
LOG_LEVEL=debug
```

## 📚 **Additional Resources**

- [JWT Documentation](https://jwt.io/)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Redis Documentation](https://redis.io/documentation)
- [bcrypt Documentation](https://github.com/dcodeIO/bcrypt.js/)
