const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const Interaction = require('../models/Interaction');
const { protect, petOwnerOrVet } = require('../middleware/auth');
const { petAccessLimiter } = require('../middleware/security');
const { sendCriticalInteractionAlert } = require('../utils/email');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// @desc    Check drug interactions for a pet
// @route   POST /api/interactions/check
// @access  Private
router.post('/check', petAccessLimiter, protect, async (req, res) => {
  try {
    const { petId, medications } = req.body;

    if (!petId || !medications || !Array.isArray(medications)) {
      return res.status(400).json({
        success: false,
        message: 'Pet ID and medications array are required'
      });
    }

    // Get pet information
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check if user owns the pet or is a vet
    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'vet') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this pet\'s information'
      });
    }

    // Extract medication names
    const drugNames = medications.map(med => med.name || med);
    // Debug logging removed for now

    // Check for drug-drug interactions
    const interactions = await Interaction.findInteractionsForDrugs(drugNames, pet.species);

    // Load comprehensive interaction database
    const comprehensiveDbPath = path.join(__dirname, '../data/comprehensive-interactions.json');
    const comprehensiveData = JSON.parse(await fs.readFile(comprehensiveDbPath, 'utf8'));

    // Check for drug-drug interactions using comprehensive database
    const drugInteractions = [];
    for (let i = 0; i < drugNames.length; i++) {
      for (let j = i + 1; j < drugNames.length; j++) {
        const drug1 = drugNames[i].toLowerCase();
        const drug2 = drugNames[j].toLowerCase();
        const interaction = comprehensiveData.drug_interactions.find(int => 
          ((int.drug1.toLowerCase() === drug1 && int.drug2.toLowerCase() === drug2) ||
           (int.drug1.toLowerCase() === drug2 && int.drug2.toLowerCase() === drug1)) &&
          (int.species.includes(pet.species) || int.species.includes('all'))
        );
        
        if (interaction) {
          drugInteractions.push(interaction);
        }
      }
    }

    // Check for toxic medications using comprehensive database
    const toxicMeds = [];
    const speciesToxicMeds = comprehensiveData.toxic_medications[pet.species] || [];
    
    drugNames.forEach(drugName => {
      const toxicMed = speciesToxicMeds.find(med => 
        med.name.toLowerCase() === drugName.toLowerCase() ||
        med.brand_names.some(brand => brand.toLowerCase() === drugName.toLowerCase())
      );
      
      if (toxicMed) {
        toxicMeds.push({
          medication: drugName,
          toxicData: toxicMed
        });
      }
    });

    // Calculate overall risk level
    let overallRisk = 'low';
    if (toxicMeds.length > 0) {
      overallRisk = 'critical';
    } else if (drugInteractions.some(int => int.riskLevel === 'high' || int.riskLevel === 'critical')) {
      overallRisk = 'high';
    } else if (drugInteractions.some(int => int.riskLevel === 'medium')) {
      overallRisk = 'medium';
    }

    // Prepare response
    const result = {
      petInfo: {
        id: pet._id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        weight: pet.weight,
        weightUnit: pet.weightUnit
      },
      medicationsChecked: drugNames,
      overallRiskLevel: overallRisk,
      drugInteractions: drugInteractions.map(interaction => ({
        drug1: interaction.drug1,
        drug2: interaction.drug2,
        severity: interaction.severity,
        riskLevel: interaction.riskLevel,
        mechanism: interaction.mechanism,
        clinicalEffects: interaction.clinicalEffects,
        management: interaction.management,
        alternatives: interaction.alternatives || [],
        monitoringRequired: interaction.monitoringRequired || false
      })),
      toxicMedications: toxicMeds,
      recommendations: generateRecommendations(drugInteractions, toxicMeds, pet),
      timestamp: new Date().toISOString()
    };

    // Send email alert for critical interactions or toxic medications
    if (overallRisk === 'critical' || (overallRisk === 'high' && (toxicMeds.length > 0 || drugInteractions.some(int => int.riskLevel === 'critical')))) {
      try {
        // Get pet owner information
        const petWithOwner = await Pet.findById(petId).populate('owner');
        
        const criticalMedications = [
          ...toxicMeds.map(med => med.medication),
          ...drugInteractions.filter(int => int.riskLevel === 'critical').map(int => `${int.drug1} + ${int.drug2}`)
        ];

        const emailResult = await sendCriticalInteractionAlert(
          { medications: criticalMedications },
          petWithOwner,
          petWithOwner.owner
        );

        if (emailResult && emailResult.success) {
          console.log(`🚨 Critical interaction alert sent for ${pet.name}: ${emailResult.id}`);
        } else {
          console.log(`⚠️ Failed to send critical interaction alert for ${pet.name}`);
        }
      } catch (emailError) {
        console.error('❌ Critical interaction email error:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get AI-powered medication analysis
// @route   POST /api/interactions/ai-analysis
// @access  Private
router.post('/ai-analysis', petAccessLimiter, protect, async (req, res) => {
  try {
    const { petId, medications, query } = req.body;

    if (!petId || !medications) {
      return res.status(400).json({
        success: false,
        message: 'Pet ID and medications are required'
      });
    }

    // Get pet information
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check authorization
    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'vet') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this pet\'s information'
      });
    }

    // Call AI service
    try {
      const aiResponse = await axios.post(`${process.env.ML_SERVICE_URL || 'https://pawrx-ml-production.up.railway.app'}/analyze-medications`, {
        pet: {
          species: pet.species,
          breed: pet.breed,
          weight: pet.weight,
          weightUnit: pet.weightUnit,
          age: pet.age,
          ageUnit: pet.ageUnit,
          medicalHistory: pet.medicalHistory
        },
        medications: medications,
        query: query || 'Analyze these medications for potential risks and interactions'
      });

      res.status(200).json({
        success: true,
        data: aiResponse.data
      });

    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      
      // Fallback to basic analysis if AI service is unavailable
      const basicAnalysis = {
        analysis: 'AI service is currently unavailable. Please use the basic interaction checker.',
        recommendations: [
          'Consult with your veterinarian for medication safety',
          'Monitor your pet for any adverse reactions',
          'Keep a record of all medications and dosages'
        ],
        riskLevel: 'unknown'
      };

      res.status(200).json({
        success: true,
        data: basicAnalysis,
        note: 'AI service unavailable - providing basic recommendations'
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

// @desc    Get medication alternatives
// @route   POST /api/interactions/alternatives
// @access  Private
router.post('/alternatives', protect, async (req, res) => {
  try {
    const { medication, species, condition } = req.body;

    if (!medication || !species) {
      return res.status(400).json({
        success: false,
        message: 'Medication and species are required'
      });
    }

    // Load common medications data
    const commonMedsPath = path.join(__dirname, '../../data/common-medications.json');
    const commonMedsData = JSON.parse(await fs.readFile(commonMedsPath, 'utf8'));

    const speciesMeds = commonMedsData.common_medications[species] || [];
    
    // Find alternatives based on similar use cases
    const alternatives = speciesMeds.filter(med => {
      if (condition) {
        return med.common_uses.some(use => 
          use.toLowerCase().includes(condition.toLowerCase())
        );
      }
      return med.name.toLowerCase() !== medication.toLowerCase();
    });

    res.status(200).json({
      success: true,
      data: {
        originalMedication: medication,
        species: species,
        condition: condition,
        alternatives: alternatives.slice(0, 5) // Limit to 5 alternatives
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

// Helper function to generate recommendations
function generateRecommendations(interactions, toxicMeds, pet) {
  const recommendations = [];

  // Critical toxic medication warnings
  if (toxicMeds.length > 0) {
    toxicMeds.forEach(toxic => {
      recommendations.push({
        type: 'critical',
        message: `⚠️ DANGER: ${toxic.medication} is ${toxic.toxicData.toxicity_level} toxic to ${pet.species}s. ${toxic.toxicData.reason}. Discontinue immediately and contact your veterinarian.`,
        action: 'immediate_vet_contact'
      });
    });
  }

  // Drug interaction warnings
  if (interactions.length > 0) {
    const criticalInteractions = interactions.filter(int => int.riskLevel === 'critical');
    const highRiskInteractions = interactions.filter(int => int.riskLevel === 'high');
    const mediumRiskInteractions = interactions.filter(int => int.riskLevel === 'medium');
    
    if (criticalInteractions.length > 0) {
      recommendations.push({
        type: 'critical',
        message: `🚨 CRITICAL: ${criticalInteractions.length} life-threatening drug interaction(s) detected. Contact veterinarian immediately.`,
        action: 'emergency_vet_contact'
      });
    }

    if (highRiskInteractions.length > 0) {
      recommendations.push({
        type: 'high',
        message: `⚠️ HIGH RISK: ${highRiskInteractions.length} serious drug interaction(s) detected. Veterinary consultation required before continuing.`,
        action: 'urgent_vet_consultation'
      });
    }

    if (mediumRiskInteractions.length > 0) {
      recommendations.push({
        type: 'medium',
        message: `⚡ CAUTION: ${mediumRiskInteractions.length} moderate drug interaction(s) detected. Enhanced monitoring recommended.`,
        action: 'increased_monitoring'
      });
    }

    // Specific monitoring recommendations
    interactions.forEach(interaction => {
      if (interaction.clinicalEffects && interaction.clinicalEffects.length > 0) {
        recommendations.push({
          type: 'monitoring',
          message: `Monitor for: ${interaction.clinicalEffects.join(', ')} when using ${interaction.drug1} with ${interaction.drug2}`,
          action: 'close_monitoring'
        });
      }
      
      // Add alternative suggestions if available
      if (interaction.alternatives && interaction.alternatives.length > 0) {
        recommendations.push({
          type: 'info',
          message: `Consider alternatives: ${interaction.alternatives.join(', ')} instead of current combination`,
          action: 'consider_alternatives'
        });
      }
    });
  }

  // General safety recommendations
  const totalMeds = typeof pet.medications !== 'undefined' ? pet.medications.length : 0;
  if (totalMeds > 4) {
    recommendations.push({
      type: 'info',
      message: 'Your pet is on multiple medications. Regular veterinary check-ups and blood work are recommended to monitor for side effects.',
      action: 'regular_checkups'
    });
  }

  // If no issues found
  if (toxicMeds.length === 0 && interactions.length === 0) {
    recommendations.push({
      type: 'low',
      message: '✅ No dangerous interactions detected with the current medication combination.',
      action: 'routine_monitoring'
    });
  }

  return recommendations;
}

module.exports = router; 