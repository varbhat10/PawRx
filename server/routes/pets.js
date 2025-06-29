const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect, petOwnerOrVet } = require('../middleware/auth');
const Joi = require('joi');

// Validation schema for pet creation
const petSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'ferret', 'other').required(),
  breed: Joi.string().max(50),
  weight: Joi.number().min(0).required(),
  weightUnit: Joi.string().valid('kg', 'lbs').default('kg'),
  age: Joi.number().min(0).required(),
  ageUnit: Joi.string().valid('days', 'weeks', 'months', 'years').default('years'),
  sex: Joi.string().valid('male', 'female', 'unknown').required(),
  neutered: Joi.boolean().default(false),
  veterinarian: Joi.object({
    name: Joi.string(),
    clinic: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email()
  }),
  medicalHistory: Joi.object({
    allergies: Joi.array().items(Joi.string()),
    chronicConditions: Joi.array().items(Joi.string()),
    vaccinations: Joi.array().items(Joi.object({
      vaccine: Joi.string().required(),
      date: Joi.date().required(),
      nextDue: Joi.date(),
      veterinarian: Joi.string(),
      batchNumber: Joi.string()
    }))
  }),
  emergencyContact: Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    relationship: Joi.string()
  }),
  insuranceInfo: Joi.object({
    provider: Joi.string(),
    policyNumber: Joi.string(),
    expirationDate: Joi.date()
  }),
  microchipId: Joi.string(),
  photo: Joi.string(),
  lastCheckup: Joi.date(),
  nextCheckup: Joi.date()
});

// @desc    Get all pets for user
// @route   GET /api/pets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id, isActive: true })
      .select('+currentMedications +appointments +adverseReactions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
router.get('/:id', protect, petOwnerOrVet, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.pet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = petSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Add owner to pet data
    const petData = {
      ...value,
      owner: req.user._id
    };

    const pet = await Pet.create(petData);

    res.status(201).json({
      success: true,
      data: pet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
router.put('/:id', protect, petOwnerOrVet, async (req, res) => {
  try {
    // Only allow certain fields to be updated
    const allowedFields = [
      'name', 'breed', 'weight', 'weightUnit', 'age', 'ageUnit',
      'neutered', 'veterinarian', 'medicalHistory', 'emergencyContact',
      'insuranceInfo', 'microchipId', 'photo', 'lastCheckup', 'nextCheckup'
    ];

    const fieldsToUpdate = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        fieldsToUpdate[key] = req.body[key];
      }
    });

    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete pet (hard delete)
// @route   DELETE /api/pets/:id
// @access  Private
router.delete('/:id', protect, petOwnerOrVet, async (req, res) => {
  try {
    // Check if permanent deletion is requested
    const { permanent } = req.query;
    
    if (permanent === 'true') {
      // Hard delete - completely remove from database
      await Pet.findByIdAndDelete(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Pet permanently deleted successfully'
      });
    } else {
      // Soft delete - set isActive to false
      await Pet.findByIdAndUpdate(req.params.id, { isActive: false });

      res.status(200).json({
        success: true,
        message: 'Pet deleted successfully'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get pet's medication dashboard
// @route   GET /api/pets/:id/dashboard
// @access  Private
router.get('/:id/dashboard', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    // Calculate medication status
    const activeMedications = pet.currentMedications.filter(med => med.status === 'active');
    const totalMedications = activeMedications.length;
    
    // Simple risk assessment based on number of medications
    let riskLevel = 'green';
    if (totalMedications > 5) {
      riskLevel = 'red';
    } else if (totalMedications > 3) {
      riskLevel = 'yellow';
    }

    // Recent adverse reactions
    const recentReactions = pet.adverseReactions
      .filter(reaction => {
        const reactionDate = new Date(reaction.date);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return reactionDate > sixMonthsAgo;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Upcoming checkups
    const upcomingCheckup = pet.nextCheckup ? new Date(pet.nextCheckup) : null;
    const isCheckupDue = upcomingCheckup && upcomingCheckup <= new Date();

    const dashboard = {
      pet: {
        id: pet._id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.ageString,
        weight: pet.weightString
      },
      medicationSummary: {
        totalActive: totalMedications,
        riskLevel,
        activeMedications: activeMedications.map(med => ({
          id: med._id,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: med.startDate
        }))
      },
      alerts: {
        checkupDue: isCheckupDue,
        recentReactions: recentReactions.length,
        highRiskMedications: activeMedications.filter(med => 
          med.name.toLowerCase().includes('nsaid') || 
          med.name.toLowerCase().includes('steroid')
        ).length
      },
      recentActivity: {
        lastMedicationAdded: activeMedications.length > 0 ? 
          activeMedications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null,
        lastReaction: recentReactions.length > 0 ? recentReactions[0] : null,
        lastCheckup: pet.lastCheckup
      }
    };

    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get pet's medications (proxy to medications route)
// @route   GET /api/pets/:id/medications
// @access  Private
router.get('/:id/medications', protect, petOwnerOrVet, async (req, res) => {
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

// @desc    Get pet's adverse reactions (proxy to medications route)
// @route   GET /api/pets/:id/reactions
// @access  Private
router.get('/:id/reactions', protect, petOwnerOrVet, async (req, res) => {
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

// @desc    Add medication to pet
// @route   POST /api/pets/:id/medications
// @access  Private
router.post('/:id/medications', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    // Add the medication to current medications
    pet.currentMedications.push({
      ...req.body,
      startDate: req.body.startDate || new Date()
    });
    
    await pet.save();

    res.status(201).json({
      success: true,
      data: pet.currentMedications[pet.currentMedications.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update medication
// @route   PUT /api/pets/:id/medications/:medicationId
// @access  Private
router.put('/:id/medications/:medicationId', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    const medication = pet.currentMedications.id(req.params.medicationId);
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Update the medication
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
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

// @desc    Delete medication
// @route   DELETE /api/pets/:id/medications/:medicationId
// @access  Private
router.delete('/:id/medications/:medicationId', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    const medication = pet.currentMedications.id(req.params.medicationId);
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Move to history and mark as discontinued
    const medicationData = medication.toObject();
    medicationData.status = 'discontinued';
    medicationData.endDate = new Date();
    
    pet.medicationHistory.push(medicationData);
    pet.currentMedications.pull(req.params.medicationId);
    
    await pet.save();

    res.status(200).json({
      success: true,
      message: 'Medication deleted successfully'
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
// @route   POST /api/pets/:id/reactions
// @access  Private
router.post('/:id/reactions', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    // Add the adverse reaction
    pet.adverseReactions.push(req.body);
    await pet.save();

    res.status(201).json({
      success: true,
      data: pet.adverseReactions[pet.adverseReactions.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add appointment to pet
router.post('/:id/appointments', protect, async (req, res) => {
  try {
    const petId = req.params.id;
    const appointmentData = req.body;

    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    pet.appointments.push(appointmentData);
    await pet.save();

    res.json({ 
      success: true, 
      message: 'Appointment scheduled successfully',
      data: pet.appointments[pet.appointments.length - 1]
    });
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update appointment status
router.put('/:id/appointments/:appointmentId', protect, async (req, res) => {
  try {
    const { id: petId, appointmentId } = req.params;
    const { status } = req.body;

    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    const appointment = pet.appointments.id(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await pet.save();

    res.json({ 
      success: true, 
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get pet appointments
router.get('/:id/appointments', protect, async (req, res) => {
  try {
    const petId = req.params.id;

    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    res.json({ 
      success: true, 
      data: pet.appointments || []
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 