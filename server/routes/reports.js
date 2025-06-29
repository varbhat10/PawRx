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
  let yPosition = 50;
  
  // Professional Header with branding
  doc.rect(0, 0, doc.page.width, 80).fill('#2563eb');
  doc.fillColor('white')
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('🐾 PawRx Medical Report', 50, 25);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text(`Generated on ${moment().format('MMMM DD, YYYY')}`, 50, 50);
     
  // Reset color and position
  doc.fillColor('black');
  yPosition = 100;
  
  // Pet Profile Section with styled box
  drawSectionHeader(doc, 'Pet Profile', yPosition);
  yPosition += 40;
  
  // Pet info in a clean table format
  const petInfo = [
    ['Name:', pet.name],
    ['Species:', pet.species],
    ['Breed:', pet.breed || 'Not specified'],
    ['Age:', `${pet.age} ${pet.ageUnit}`],
    ['Weight:', `${pet.weight} ${pet.weightUnit}`],
    ['Sex:', `${pet.sex}${pet.neutered ? ' (Neutered/Spayed)' : ''}`],
    ['Microchip:', pet.microchipId || 'None recorded']
  ];
  
  yPosition = drawInfoTable(doc, petInfo, yPosition);
  yPosition += 30;
  
  // Veterinarian Information
  if (pet.veterinarian && pet.veterinarian.name) {
    drawSectionHeader(doc, 'Veterinary Care', yPosition);
    yPosition += 40;
    
    const vetInfo = [
      ['Primary Veterinarian:', pet.veterinarian.name],
      ['Clinic:', pet.veterinarian.clinic || 'Not specified'],
      ['Phone:', pet.veterinarian.phone || 'Not provided']
    ];
    
    yPosition = drawInfoTable(doc, vetInfo, yPosition);
    yPosition += 30;
  }
  
  // Medical Alerts Section
  const hasAlerts = (pet.medicalHistory?.allergies?.length > 0) || 
                   (pet.medicalHistory?.chronicConditions?.length > 0);
  
  if (hasAlerts) {
    // Red alert box for important medical info
    doc.rect(40, yPosition, doc.page.width - 80, 15).fill('#fef2f2');
    doc.fillColor('#dc2626')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('⚠️ MEDICAL ALERTS', 50, yPosition + 2);
    
    doc.fillColor('black');
    yPosition += 25;
    
    if (pet.medicalHistory.allergies?.length > 0) {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#dc2626')
         .text('Allergies:', 50, yPosition);
      
      doc.font('Helvetica')
         .fillColor('black')
         .text(pet.medicalHistory.allergies.join(', '), 120, yPosition);
      yPosition += 20;
    }
    
    if (pet.medicalHistory.chronicConditions?.length > 0) {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#dc2626')
         .text('Conditions:', 50, yPosition);
      
      doc.font('Helvetica')
         .fillColor('black')
         .text(pet.medicalHistory.chronicConditions.join(', '), 120, yPosition);
      yPosition += 20;
    }
    yPosition += 20;
  }
  
  // Current Medications Section
  if (yPosition > 650) {
    doc.addPage();
    yPosition = 50;
  }
  
  drawSectionHeader(doc, 'Current Medications', yPosition);
  yPosition += 40;
  
  if (pet.currentMedications.length === 0) {
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('No current medications prescribed', 50, yPosition);
    yPosition += 30;
  } else {
    yPosition = drawMedicationTable(doc, pet.currentMedications, yPosition);
  }
  
  // Vaccination History
  if (pet.medicalHistory?.vaccinations?.length > 0) {
    if (yPosition > 600) {
      doc.addPage();
      yPosition = 50;
    }
    
    drawSectionHeader(doc, 'Vaccination History', yPosition);
    yPosition += 40;
    
    yPosition = drawVaccinationTable(doc, pet.medicalHistory.vaccinations, yPosition);
  }
  
  // Adverse Reactions
  if (pet.adverseReactions?.length > 0) {
    if (yPosition > 600) {
      doc.addPage();
      yPosition = 50;
    }
    
    drawSectionHeader(doc, 'Adverse Reactions', yPosition);
    yPosition += 40;
    
    yPosition = drawAdverseReactionsTable(doc, pet.adverseReactions, yPosition);
  }
  
  // Medication History
  if (pet.medicationHistory?.length > 0) {
    doc.addPage();
    yPosition = 50;
    
    drawSectionHeader(doc, 'Medication History', yPosition);
    yPosition += 40;
    
    yPosition = drawMedicationTable(doc, pet.medicationHistory, yPosition, true);
  }
  
  // Appointments History
  if (pet.appointments?.length > 0) {
    if (yPosition > 600) {
      doc.addPage();
      yPosition = 50;
    }
    
    drawSectionHeader(doc, 'Appointment History', yPosition);
    yPosition += 40;
    
    yPosition = drawAppointmentTable(doc, pet.appointments, yPosition);
  }
  
  // Footer on last page
  addFooter(doc, pet);
}

// Helper function to draw styled section headers
function drawSectionHeader(doc, title, yPosition) {
  // Blue background bar
  doc.rect(40, yPosition, doc.page.width - 80, 25).fill('#eff6ff');
  
  // Header text
  doc.fillColor('#1d4ed8')
     .fontSize(16)
     .font('Helvetica-Bold')
     .text(title, 50, yPosition + 5);
     
  // Bottom border
  doc.moveTo(50, yPosition + 25)
     .lineTo(doc.page.width - 50, yPosition + 25)
     .strokeColor('#1d4ed8')
     .lineWidth(2)
     .stroke();
     
  doc.fillColor('black');
}

// Helper function to draw clean info tables
function drawInfoTable(doc, data, yPosition) {
  const startY = yPosition;
  
  data.forEach((row, index) => {
    const y = startY + (index * 18);
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.rect(50, y - 2, doc.page.width - 100, 16).fill('#f9fafb');
    }
    
    doc.fillColor('black')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text(row[0], 55, y);
       
    doc.font('Helvetica')
       .text(row[1], 150, y);
  });
  
  return startY + (data.length * 18) + 10;
}

// Helper function to draw medication tables
function drawMedicationTable(doc, medications, yPosition, includeEndDate = false) {
  let currentY = yPosition;
  
  medications.forEach((med, index) => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 50;
    }
    
    // Medication name with status
    doc.rect(50, currentY, doc.page.width - 100, 20).fill('#f8fafc');
    doc.fillColor('#1f2937')
       .fontSize(13)
       .font('Helvetica-Bold')
       .text(`${med.name}${med.brandName ? ` (${med.brandName})` : ''}`, 55, currentY + 4);
    
    // Status badge
    const statusColor = med.status === 'active' ? '#10b981' : 
                       med.status === 'discontinued' ? '#ef4444' : '#6b7280';
    doc.fillColor(statusColor)
       .fontSize(10)
       .text(med.status.toUpperCase(), doc.page.width - 100, currentY + 5);
    
    currentY += 25;
    
    // Medication details in a clean grid
    const details = [
      ['Dosage:', med.dosage || 'Not specified'],
      ['Frequency:', med.frequency || 'Not specified'],
      ['Route:', med.route || 'Not specified'],
      ['Start Date:', moment(med.startDate).format('MMM DD, YYYY')]
    ];
    
    if (includeEndDate && med.endDate) {
      details.push(['End Date:', moment(med.endDate).format('MMM DD, YYYY')]);
    }
    
    if (med.prescribedBy) {
      details.push(['Prescribed By:', med.prescribedBy]);
    }
    
    if (med.reason) {
      details.push(['Reason:', med.reason]);
    }
    
    details.forEach((detail, detailIndex) => {
      doc.fillColor('black')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text(detail[0], 60, currentY);
         
      doc.font('Helvetica')
         .text(detail[1], 140, currentY);
      currentY += 14;
    });
    
    currentY += 15; // Space between medications
  });
  
  return currentY;
}

// Helper function to draw vaccination table
function drawVaccinationTable(doc, vaccinations, yPosition) {
  let currentY = yPosition;
  
  vaccinations.forEach((vacc, index) => {
    doc.rect(50, currentY, doc.page.width - 100, 16).fill(index % 2 === 0 ? '#f9fafb' : 'white');
    
    doc.fillColor('black')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text(vacc.vaccine, 55, currentY + 2);
       
    doc.font('Helvetica')
       .text(moment(vacc.date).format('MMM DD, YYYY'), 200, currentY + 2);
       
    if (vacc.nextDue) {
      doc.text(`Next: ${moment(vacc.nextDue).format('MMM DD, YYYY')}`, 320, currentY + 2);
    }
    
    currentY += 18;
  });
  
  return currentY + 20;
}

// Helper function to draw adverse reactions table
function drawAdverseReactionsTable(doc, reactions, yPosition) {
  let currentY = yPosition;
  
  reactions.forEach((reaction, index) => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 50;
    }
    
    // Reaction header with severity color
    const severityColor = reaction.severity === 'severe' || reaction.severity === 'life-threatening' ? 
                         '#ef4444' : reaction.severity === 'moderate' ? '#f59e0b' : '#10b981';
    
    doc.rect(50, currentY, doc.page.width - 100, 20).fill('#fef2f2');
    doc.fillColor('#dc2626')
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(`Reaction to ${reaction.medication}`, 55, currentY + 4);
    
    doc.fillColor(severityColor)
       .fontSize(10)
       .text(reaction.severity.toUpperCase(), doc.page.width - 120, currentY + 5);
    
    currentY += 25;
    
    const details = [
      ['Date:', moment(reaction.date).format('MMM DD, YYYY')],
      ['Symptoms:', reaction.symptoms.join(', ')],
      ['Duration:', reaction.duration || 'Not specified'],
      ['Treatment:', reaction.treatment || 'Not specified'],
      ['Outcome:', reaction.outcome || 'Not specified']
    ];
    
    if (reaction.notes) {
      details.push(['Notes:', reaction.notes]);
    }
    
    details.forEach((detail) => {
      doc.fillColor('black')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text(detail[0], 60, currentY);
         
      doc.font('Helvetica')
         .text(detail[1], 120, currentY, { width: doc.page.width - 170 });
      currentY += 14;
    });
    
    currentY += 15;
  });
  
  return currentY;
}

// Helper function to draw appointment table
function drawAppointmentTable(doc, appointments, yPosition) {
  let currentY = yPosition;
  
  appointments.forEach((apt, index) => {
    doc.rect(50, currentY, doc.page.width - 100, 16).fill(index % 2 === 0 ? '#f9fafb' : 'white');
    
    const statusColor = apt.status === 'completed' ? '#10b981' : 
                       apt.status === 'cancelled' ? '#ef4444' : '#3b82f6';
    
    doc.fillColor('black')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text(moment(apt.date).format('MMM DD, YYYY'), 55, currentY + 2);
       
    doc.font('Helvetica')
       .text(apt.type || 'Check-up', 150, currentY + 2);
       
    doc.fillColor(statusColor)
       .text(apt.status || 'scheduled', 280, currentY + 2);
       
    if (apt.veterinarian) {
      doc.fillColor('black')
         .text(apt.veterinarian, 360, currentY + 2);
    }
    
    currentY += 18;
  });
  
  return currentY + 20;
}

// Helper function to add professional footer
function addFooter(doc, pet) {
  const footerY = doc.page.height - 60;
  
  doc.rect(0, footerY, doc.page.width, 60).fill('#f3f4f6');
  
  doc.fillColor('#6b7280')
     .fontSize(10)
     .font('Helvetica')
     .text('This report was generated by PawRx - Pet Medication Management System', 50, footerY + 15);
     
  doc.text(`Report for ${pet.name} • Generated ${moment().format('MMMM DD, YYYY at h:mm A')}`, 50, footerY + 30);
  
  doc.text('For questions about this report, contact your veterinarian.', 50, footerY + 45);
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