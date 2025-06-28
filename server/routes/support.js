const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendContactSupportEmail } = require('../utils/email');
const Joi = require('joi');

// Validation schema for contact form
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(5).max(200).required(),
  category: Joi.string().valid(
    'general',
    'technical', 
    'bug',
    'feature',
    'account',
    'medication',
    'emergency'
  ).required(),
  message: Joi.string().min(10).max(5000).required(),
  urgent: Joi.boolean().default(false)
});

// @desc    Submit contact support form
// @route   POST /api/support/contact
// @access  Private (optional - can work for anonymous users too)
router.post('/contact', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, subject, category, message, urgent } = value;

    // Get user information if authenticated
    let userInfo = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userInfo = await User.findById(decoded.id).select('-password');
      } catch (tokenError) {
        // User not authenticated, continue anyway
      }
    }

    // Prepare support request data
    const supportData = {
      name,
      email,
      subject,
      category,
      message,
      urgent,
      timestamp: new Date().toISOString(),
      userInfo: userInfo ? {
        id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        accountType: userInfo.accountType,
        createdAt: userInfo.createdAt
      } : null,
      submitterIP: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // Send email notification
    await sendContactSupportEmail(supportData);

    // Store in database (optional - you could create a Support model)
    // For now, we'll just send the email

    res.status(200).json({
      success: true,
      message: 'Support request submitted successfully',
      data: {
        submissionId: `SUP-${Date.now()}`,
        estimatedResponseTime: urgent ? '4 hours' : '24 hours',
        contactEmail: 'varbhat10@gmail.com'
      }
    });

  } catch (error) {
    console.error('Contact support error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit support request'
    });
  }
});

// @desc    Get support categories
// @route   GET /api/support/categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    { value: 'general', label: 'General Inquiry', description: 'General questions about PawRX' },
    { value: 'technical', label: 'Technical Issue', description: 'Website or app not working properly' },
    { value: 'bug', label: 'Bug Report', description: 'Report a software bug or error' },
    { value: 'feature', label: 'Feature Request', description: 'Suggest new features or improvements' },
    { value: 'account', label: 'Account Support', description: 'Login, registration, or account issues' },
    { value: 'medication', label: 'Medication Question', description: 'Questions about drug interactions or medications' },
    { value: 'emergency', label: 'Emergency/Urgent', description: 'Urgent issues requiring immediate attention' }
  ];

  res.json({
    success: true,
    data: categories
  });
});

// @desc    Get support FAQ
// @route   GET /api/support/faq
// @access  Public
router.get('/faq', (req, res) => {
  const faq = [
    {
      question: "How do I add a new pet to my account?",
      answer: "Go to the Medications page and click 'Add New Pet' button. Fill in your pet's details including name, species, breed, age, and weight."
    },
    {
      question: "How accurate is the drug interaction checker?",
      answer: "Our interaction checker uses a comprehensive database of known drug interactions. However, always consult with your veterinarian before making any medication decisions."
    },
    {
      question: "Can I use PawRX for multiple pets?",
      answer: "Yes! You can add and manage multiple pets under one account. Each pet has their own profile and medication history."
    },
    {
      question: "How do I report an adverse reaction?",
      answer: "Go to the Medications page, select your pet, and click 'Report Adverse Reaction'. Fill out the form with details about the reaction."
    },
    {
      question: "Is my pet's data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your pet's medical information."
    }
  ];

  res.json({
    success: true,
    data: faq
  });
});

module.exports = router; 