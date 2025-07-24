const rateLimit = require('express-rate-limit');

// Rate limiter for pet access endpoints to prevent enumeration attacks
const petAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for pet endpoints
  message: {
    success: false,
    message: 'Too many pet access requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to include user ID for authenticated users
  keyGenerator: (req) => {
    return req.user ? `${req.ip}-${req.user._id}` : req.ip;
  }
});

// Rate limiter for pet modification endpoints (more restrictive)
const petModificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit to 50 modification requests per windowMs
  message: {
    success: false,
    message: 'Too many pet modification requests, please try again later.'
  },
  keyGenerator: (req) => {
    return req.user ? `${req.ip}-${req.user._id}` : req.ip;
  }
});

// Security monitoring middleware to log suspicious access patterns
const petAccessLogger = (req, res, next) => {
  // Log pet access attempts with relevant security info
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?._id,
    petId: req.params.id || req.params.petId,
    method: req.method,
    endpoint: req.originalUrl,
    referrer: req.get('Referrer')
  };

  // Log to console (in production, this should go to a proper logging service)
  console.log('🔍 Pet Access:', JSON.stringify(logData));

  // Store original end function
  const originalEnd = res.end;
  
  // Override end function to log response
  res.end = function(chunk, encoding) {
    logData.statusCode = res.statusCode;
    logData.success = res.statusCode < 400;
    
    if (!logData.success) {
      console.log('🚨 Failed Pet Access:', JSON.stringify(logData));
    }
    
    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Validate ObjectId format to prevent NoSQL injection attempts
const validateObjectId = (req, res, next) => {
  const petId = req.params.id || req.params.petId;
  
  if (petId && !petId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pet ID format'
    });
  }
  
  next();
};

// Enhanced pet ownership verification with additional security checks
const enhancedPetSecurity = async (req, res, next) => {
  try {
    const Pet = require('../models/Pet');
    const petId = req.params.petId || req.params.id;
    
    // Enhanced query with additional security checks
    const pet = await Pet.findOne({
      _id: petId,
      isActive: true  // Only allow access to active pets
    });
    
    if (!pet) {
      // Log potential enumeration attempt
      console.log(`🚨 Pet enumeration attempt - Pet ID: ${petId}, User: ${req.user._id}, IP: ${req.ip}`);
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check ownership (users can only access their own pets, vets can access any)
    const isOwner = pet.owner.toString() === req.user._id.toString();
    const isVet = req.user.role === 'vet';
    
    if (!isOwner && !isVet) {
      // Log unauthorized access attempt
      console.log(`🚨 Unauthorized pet access attempt - Pet ID: ${petId}, Owner: ${pet.owner}, User: ${req.user._id}, IP: ${req.ip}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this pet\'s information'
      });
    }

    // Add additional context for audit trail
    req.pet = pet;
    req.isOwner = isOwner;
    req.isVet = isVet;
    req.securityContext = {
      petId,
      userId: req.user._id,
      accessType: isOwner ? 'owner' : 'vet',
      timestamp: new Date()
    };
    
    next();
  } catch (error) {
    console.error('🚨 Pet security middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Suspicious activity detection
const detectSuspiciousActivity = (req, res, next) => {
  // Simple detection for rapid sequential requests to different pet IDs
  const userKey = `${req.ip}-${req.user?._id || 'anon'}`;
  
  if (!global.petAccessTracking) {
    global.petAccessTracking = new Map();
  }
  
  const now = Date.now();
  const userActivity = global.petAccessTracking.get(userKey) || [];
  
  // Clean old entries (older than 5 minutes)
  const recentActivity = userActivity.filter(timestamp => now - timestamp < 5 * 60 * 1000);
  
  // Check for suspicious patterns (more than 20 pet access attempts in 5 minutes)
  if (recentActivity.length > 20) {
    console.log(`🚨 Suspicious activity detected - User: ${userKey}, Recent attempts: ${recentActivity.length}`);
    return res.status(429).json({
      success: false,
      message: 'Suspicious activity detected. Access temporarily restricted.'
    });
  }
  
  // Add current attempt
  recentActivity.push(now);
  global.petAccessTracking.set(userKey, recentActivity);
  
  next();
};

module.exports = {
  petAccessLimiter,
  petModificationLimiter,
  petAccessLogger,
  validateObjectId,
  enhancedPetSecurity,
  detectSuspiciousActivity
}; 