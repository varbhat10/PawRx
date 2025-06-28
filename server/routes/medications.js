const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User');
const { protect, petOwnerOrVet } = require('../middleware/auth');
const { sendAdverseReactionAlert } = require('../utils/email');
const Joi = require('joi');

// Validation schema for medication
const medicationSchema = Joi.object({
  name: Joi.string().required(),
  brandName: Joi.string().allow(''),
  dosage: Joi.string().allow(''),
  frequency: Joi.string().allow(''),
  route: Joi.string().valid('oral', 'topical', 'injection', 'inhalation', 'other').allow('').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  prescribedBy: Joi.string().allow(''),
  reason: Joi.string().allow(''),
  instructions: Joi.string().allow('')
});

// Validation schema for adverse reaction
const reactionSchema = Joi.object({
  medication: Joi.string().required(),
  date: Joi.date().required(),
  severity: Joi.string().valid('mild', 'moderate', 'severe', 'life-threatening').required(),
  symptoms: Joi.array().items(Joi.string()).required(),
  duration: Joi.string(),
  treatment: Joi.string(),
  outcome: Joi.string().valid('recovered', 'recovering', 'ongoing', 'fatal').default('recovered'),
  reportedBy: Joi.string(),
  notes: Joi.string()
});

// @desc    Get all medications for a pet
// @route   GET /api/pets/:petId/medications
// @access  Private
router.get('/:petId/medications', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    res.status(200).json({
      success: true,
      data: {
        current: pet.currentMedications,
        history: pet.medicationHistory
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add medication to pet
// @route   POST /api/pets/:petId/medications
// @access  Private
router.post('/:petId/medications', protect, petOwnerOrVet, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = medicationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Clean up empty fields and set defaults
    const medicationData = { ...value };
    
    // If route is empty string, set to default 'oral' 
    if (!medicationData.route || medicationData.route === '') {
      medicationData.route = 'oral';
    }
    
    // Remove completely empty optional fields to avoid validation issues
    Object.keys(medicationData).forEach(key => {
      if (medicationData[key] === '' && key !== 'name') {
        delete medicationData[key];
      }
    });

    // Add medication to pet
    pet.currentMedications.push(medicationData);
    await pet.save();

    res.status(201).json({
      success: true,
      data: pet.currentMedications[pet.currentMedications.length - 1]
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${validationErrors.join(', ')}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while adding medication'
    });
  }
});

// @desc    Update medication
// @route   PUT /api/pets/:petId/medications/:medicationId
// @access  Private
router.put('/:petId/medications/:medicationId', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    const medication = pet.currentMedications.id(req.params.medicationId);
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Update allowed fields
    const allowedFields = ['dosage', 'frequency', 'endDate', 'instructions', 'status'];
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        medication[key] = req.body[key];
      }
    });

    await pet.save();

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Discontinue medication
// @route   DELETE /api/pets/:petId/medications/:medicationId
// @access  Private
router.delete('/:petId/medications/:medicationId', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    await pet.discontinueMedication(req.params.medicationId);

    res.status(200).json({
      success: true,
      message: 'Medication discontinued successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get adverse reactions for a pet
// @route   GET /api/pets/:petId/reactions
// @access  Private
router.get('/:petId/reactions', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    res.status(200).json({
      success: true,
      data: pet.adverseReactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add adverse reaction
// @route   POST /api/pets/:petId/reactions
// @access  Private
router.post('/:petId/reactions', protect, petOwnerOrVet, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = reactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const pet = await Pet.findById(req.params.petId).populate('owner');
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Add reaction data
    const reactionData = {
      ...value,
      reportedBy: req.user.name
    };

    await pet.addAdverseReaction(reactionData);

    // Send email notification for adverse reaction
    try {
      const emailResult = await sendAdverseReactionAlert(reactionData, pet, pet.owner);
      
      if (emailResult && emailResult.success) {
        console.log(`✅ Adverse reaction alert sent for ${pet.name}: ${emailResult.id}`);
      } else {
        console.log(`⚠️ Failed to send adverse reaction alert for ${pet.name}`);
      }
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      data: pet.adverseReactions[pet.adverseReactions.length - 1],
      message: 'Adverse reaction recorded and alert sent to monitoring team'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update adverse reaction
// @route   PUT /api/pets/:petId/reactions/:reactionId
// @access  Private
router.put('/:petId/reactions/:reactionId', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    const reaction = pet.adverseReactions.id(req.params.reactionId);
    if (!reaction) {
      return res.status(404).json({
        success: false,
        message: 'Adverse reaction not found'
      });
    }

    // Update allowed fields
    const allowedFields = ['severity', 'symptoms', 'duration', 'treatment', 'outcome', 'notes'];
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        reaction[key] = req.body[key];
      }
    });

    await pet.save();

    res.status(200).json({
      success: true,
      data: reaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 