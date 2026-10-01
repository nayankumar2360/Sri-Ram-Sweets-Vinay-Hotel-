require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Security and middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
// CORS configuration for local and cloud deployment (Vercel, custom domains)
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app') || 
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    // Allow for other origins as well in permissive mode, or fallback
    return callback(null, true);
  }, 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Ensure upload directories exist
const uploadDirs = ['./uploads/products', './uploads/payments'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api', require('./routes/products')); // Product and category routes (including public settings)
app.use('/api/orders', require('./routes/orders'));
app.use('/api/preorders', require('./routes/preOrders'));
app.use('/api/pre-orders', require('./routes/preOrders'));
app.use('/api/bulk-orders', require('./routes/bulkOrders'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
