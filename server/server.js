const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// Request Parsing & Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Base Route & Health Check
app.get('/', (req, res) => {
  res.json({
    message: 'AI Local Mapper API is running',
    version: '1.0.0',
    status: 'active'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'AI Local Mapper Backend'
  });
});

// Import API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/group', require('./routes/groupRoutes'));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] AI Local Mapper Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
