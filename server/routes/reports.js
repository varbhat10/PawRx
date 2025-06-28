const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect, petOwnerOrVet } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const moment = require('moment');

// @desc    Generate PDF report for pet's medication history
// @route   GET /api/reports/pet/:petId/medication-history
// @access  Private
router.get('/pet/:petId/medication-history', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pet.name}-medication-history.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    generateMedicationHistoryPDF(doc, pet);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report'
    });
  }
});

// @desc    Generate PDF report for pet's complete medical record
// @route   GET /api/reports/pet/:petId/medical-record
// @access  Private
router.get('/pet/:petId/medical-record', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pet.name}-medical-record.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    generateMedicalRecordPDF(doc, pet);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report'
    });
  }
});

// @desc    Generate adverse reactions report
// @route   GET /api/reports/pet/:petId/adverse-reactions
// @access  Private
router.get('/pet/:petId/adverse-reactions', protect, petOwnerOrVet, async (req, res) => {
  try {
    const pet = req.pet;
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pet.name}-adverse-reactions.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    generateAdverseReactionsPDF(doc, pet);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report'
    });
  }
});

// Helper function to generate medication history PDF
function generateMedicationHistoryPDF(doc, pet) {
  // Header
  doc.fontSize(20).text('Pet Medication History Report', 50, 50);
  doc.moveDown();
  
  // Pet Information
  doc.fontSize(14).text('Pet Information', 50, doc.y);
  doc.fontSize(12);
  doc.text(`Name: ${pet.name}`, 50, doc.y + 20);
  doc.text(`Species: ${pet.species}`, 50, doc.y + 15);
  doc.text(`Breed: ${pet.breed || 'Not specified'}`, 50, doc.y + 15);
  doc.text(`Weight: ${pet.weight} ${pet.weightUnit}`, 50, doc.y + 15);
  doc.text(`Age: ${pet.age} ${pet.ageUnit}`, 50, doc.y + 15);
  doc.text(`Sex: ${pet.sex}${pet.neutered ? ' (Neutered)' : ''}`, 50, doc.y + 15);
  doc.moveDown();
  
  // Current Medications
  doc.fontSize(14).text('Current Medications', 50, doc.y + 20);
  if (pet.currentMedications.length === 0) {
    doc.fontSize(12).text('No current medications', 50, doc.y + 15);
  } else {
    pet.currentMedications.forEach((med, index) => {
      doc.fontSize(12);
      doc.text(`${index + 1}. ${med.name}${med.brandName ? ` (${med.brandName})` : ''}`, 50, doc.y + 15);
      doc.text(`   Dosage: ${med.dosage}`, 50, doc.y + 12);
      doc.text(`   Frequency: ${med.frequency}`, 50, doc.y + 12);
      doc.text(`   Route: ${med.route}`, 50, doc.y + 12);
      doc.text(`   Start Date: ${moment(med.startDate).format('YYYY-MM-DD')}`, 50, doc.y + 12);
      if (med.prescribedBy) {
        doc.text(`   Prescribed By: ${med.prescribedBy}`, 50, doc.y + 12);
      }
      if (med.reason) {
        doc.text(`   Reason: ${med.reason}`, 50, doc.y + 12);
      }
      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`, 50, doc.y + 12);
      }
      doc.moveDown();
    });
  }
  
  // Medication History
  if (pet.medicationHistory.length > 0) {
    doc.addPage();
    doc.fontSize(14).text('Medication History', 50, 50);
    pet.medicationHistory.forEach((med, index) => {
      doc.fontSize(12);
      doc.text(`${index + 1}. ${med.name}${med.brandName ? ` (${med.brandName})` : ''}`, 50, doc.y + 15);
      doc.text(`   Dosage: ${med.dosage}`, 50, doc.y + 12);
      doc.text(`   Frequency: ${med.frequency}`, 50, doc.y + 12);
      doc.text(`   Start Date: ${moment(med.startDate).format('YYYY-MM-DD')}`, 50, doc.y + 12);
      if (med.endDate) {
        doc.text(`   End Date: ${moment(med.endDate).format('YYYY-MM-DD')}`, 50, doc.y + 12);
      }
      doc.text(`   Status: ${med.status}`, 50, doc.y + 12);
      doc.moveDown();
    });
  }
  
  // Footer
  doc.fontSize(10).text(`Report generated on ${moment().format('YYYY-MM-DD HH:mm:ss')}`, 50, doc.page.height - 50);
}

// Helper function to generate complete medical record PDF
function generateMedicalRecordPDF(doc, pet) {
  // Header
  doc.fontSize(20).text('Complete Medical Record', 50, 50);
  doc.moveDown();
  
  // Pet Information Section
  generatePetInfoSection(doc, pet);
  
  // Medical History Section
  if (pet.medicalHistory) {
    doc.addPage();
    doc.fontSize(16).text('Medical History', 50, 50);
    doc.moveDown();
    
    if (pet.medicalHistory.allergies && pet.medicalHistory.allergies.length > 0) {
      doc.fontSize(14).text('Allergies:', 50, doc.y + 10);
      doc.fontSize(12);
      pet.medicalHistory.allergies.forEach(allergy => {
        doc.text(`• ${allergy}`, 70, doc.y + 12);
      });
      doc.moveDown();
    }
    
    if (pet.medicalHistory.chronicConditions && pet.medicalHistory.chronicConditions.length > 0) {
      doc.fontSize(14).text('Chronic Conditions:', 50, doc.y + 10);
      doc.fontSize(12);
      pet.medicalHistory.chronicConditions.forEach(condition => {
        doc.text(`• ${condition}`, 70, doc.y + 12);
      });
      doc.moveDown();
    }
    
    if (pet.medicalHistory.vaccinations && pet.medicalHistory.vaccinations.length > 0) {
      doc.fontSize(14).text('Vaccinations:', 50, doc.y + 10);
      doc.fontSize(12);
      pet.medicalHistory.vaccinations.forEach(vacc => {
        doc.text(`• ${vacc.vaccine} - ${moment(vacc.date).format('YYYY-MM-DD')}`, 70, doc.y + 12);
        if (vacc.nextDue) {
          doc.text(`  Next due: ${moment(vacc.nextDue).format('YYYY-MM-DD')}`, 70, doc.y + 10);
        }
      });
    }
  }
  
  // Medications Section
  generateMedicationHistoryPDF(doc, pet);
  
  // Adverse Reactions Section
  if (pet.adverseReactions.length > 0) {
    doc.addPage();
    generateAdverseReactionsPDF(doc, pet);
  }
}

// Helper function to generate adverse reactions PDF
function generateAdverseReactionsPDF(doc, pet) {
  doc.fontSize(16).text('Adverse Reactions Report', 50, 50);
  doc.moveDown();
  
  generatePetInfoSection(doc, pet);
  
  if (pet.adverseReactions.length === 0) {
    doc.fontSize(12).text('No adverse reactions recorded', 50, doc.y + 20);
  } else {
    doc.fontSize(14).text('Adverse Reactions:', 50, doc.y + 20);
    pet.adverseReactions.forEach((reaction, index) => {
      doc.fontSize(12);
      doc.text(`${index + 1}. Medication: ${reaction.medication}`, 50, doc.y + 15);
      doc.text(`   Date: ${moment(reaction.date).format('YYYY-MM-DD')}`, 50, doc.y + 12);
      doc.text(`   Severity: ${reaction.severity}`, 50, doc.y + 12);
      doc.text(`   Symptoms: ${reaction.symptoms.join(', ')}`, 50, doc.y + 12);
      if (reaction.duration) {
        doc.text(`   Duration: ${reaction.duration}`, 50, doc.y + 12);
      }
      if (reaction.treatment) {
        doc.text(`   Treatment: ${reaction.treatment}`, 50, doc.y + 12);
      }
      doc.text(`   Outcome: ${reaction.outcome}`, 50, doc.y + 12);
      if (reaction.notes) {
        doc.text(`   Notes: ${reaction.notes}`, 50, doc.y + 12);
      }
      doc.moveDown();
    });
  }
  
  // Footer
  doc.fontSize(10).text(`Report generated on ${moment().format('YYYY-MM-DD HH:mm:ss')}`, 50, doc.page.height - 50);
}

// Helper function to generate pet info section
function generatePetInfoSection(doc, pet) {
  doc.fontSize(14).text('Pet Information', 50, doc.y + 10);
  doc.fontSize(12);
  doc.text(`Name: ${pet.name}`, 50, doc.y + 15);
  doc.text(`Species: ${pet.species}`, 50, doc.y + 12);
  if (pet.breed) doc.text(`Breed: ${pet.breed}`, 50, doc.y + 12);
  doc.text(`Weight: ${pet.weight} ${pet.weightUnit}`, 50, doc.y + 12);
  doc.text(`Age: ${pet.age} ${pet.ageUnit}`, 50, doc.y + 12);
  doc.text(`Sex: ${pet.sex}${pet.neutered ? ' (Neutered)' : ''}`, 50, doc.y + 12);
  
  if (pet.veterinarian && pet.veterinarian.name) {
    doc.text(`Veterinarian: ${pet.veterinarian.name}`, 50, doc.y + 12);
    if (pet.veterinarian.clinic) {
      doc.text(`Clinic: ${pet.veterinarian.clinic}`, 50, doc.y + 12);
    }
  }
  
  if (pet.microchipId) {
    doc.text(`Microchip ID: ${pet.microchipId}`, 50, doc.y + 12);
  }
  
  doc.moveDown();
}

module.exports = router; 