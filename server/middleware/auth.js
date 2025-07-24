const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - requires valid JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id);
    
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Enhanced pet security with logging and validation
exports.petOwnerOrVet = async (req, res, next) => {
  try {
    const Pet = require('../models/Pet');
    const petId = req.params.petId || req.params.id;
    
    // Validate ObjectId format to prevent NoSQL injection
    if (petId && !petId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`🚨 Invalid pet ID format attempt - ID: ${petId}, User: ${req.user._id}, IP: ${req.ip}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid pet ID format'
      });
    }
    
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
      // Log unauthorized access attempt with detailed info
      console.log(`🚨 Unauthorized pet access attempt - Pet ID: ${petId}, Owner: ${pet.owner}, User: ${req.user._id}, Role: ${req.user.role}, IP: ${req.ip}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this pet\'s information'
      });
    }

    // Add security context for audit trail
    req.pet = pet;
    req.isOwner = isOwner;
    req.isVet = isVet;
    req.securityContext = {
      petId,
      userId: req.user._id,
      accessType: isOwner ? 'owner' : 'vet',
      timestamp: new Date(),
      ip: req.ip
    };
    
    // Log successful access for monitoring
    console.log(`✅ Pet access granted - Pet: ${pet.name} (${petId}), User: ${req.user.name} (${req.user._id}), Type: ${req.securityContext.accessType}`);
    
    next();
  } catch (error) {
    console.error('🚨 Pet security middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 