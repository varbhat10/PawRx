const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const medicationRoutes = require('./routes/medications');
const interactionRoutes = require('./routes/interactions');
const reportRoutes = require('./routes/reports');
const supportRoutes = require('./routes/support');

const app = express();

// Trust proxy for Railway deployment (fixes rate limiting X-Forwarded-For warning)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting - Increased for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs (increased from 100)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS - Support multiple origins with secure configuration
const allowedOrigins = [
  'https://varbhat10.github.io',
  'https://varbhat10.github.io/PawRx',
  'https://pawrx-production.up.railway.app', 
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if it's a development origin
    if (origin && (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:'))) {
      return callback(null, true);
    }
    
    console.log('CORS rejected origin:', origin);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
console.log('MONGODB_URI debug:', JSON.stringify(process.env.MONGODB_URI));
console.log('MONGODB_URI type:', typeof process.env.MONGODB_URI);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pawrx';
console.log('Using URI:', mongoUri);

mongoose.connect(mongoUri)
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/support', supportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PawRX API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      pets: '/api/pets',
      medications: '/api/medications',
      interactions: '/api/interactions',
      reports: '/api/reports',
      support: '/api/support'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PawRX API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 