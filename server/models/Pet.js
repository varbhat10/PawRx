const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  vaccine: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  nextDue: {
    type: Date
  },
  veterinarian: String,
  batchNumber: String
});

const AppointmentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['check-up', 'checkup', 'vaccination', 'surgery', 'grooming', 'dental', 'emergency', 'other']
  },
  title: {
    type: String,
    required: false // Made optional to fix frontend mismatch
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  veterinarian: String, // Optional - not everyone knows their vet when booking
  clinic: String, // Optional - clinic info
  address: String,
  phone: String,
  notes: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: true
    },
    daysBefore: {
      type: Number,
      default: 1
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brandName: String,
  dosage: String, // Made optional to match frontend
  frequency: String, // Made optional to match frontend
  route: {
    type: String,
    enum: ['oral', 'topical', 'injection', 'inhalation', 'other'],
    default: 'oral'
  },
  startDate: {
    type: Date,
    default: Date.now // Made optional with default value
  },
  endDate: Date,
  prescribedBy: String,
  reason: String,
  instructions: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AdverseReactionSchema = new mongoose.Schema({
  medication: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'life-threatening'],
    required: true
  },
  symptoms: [String],
  duration: String,
  treatment: String,
  outcome: {
    type: String,
    enum: ['recovered', 'recovering', 'ongoing', 'fatal'],
    default: 'recovered'
  },
  reportedBy: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    maxlength: 50
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'ferret', 'other']
  },
  breed: {
    type: String,
    maxlength: 50
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: 0
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'lbs'],
    default: 'kg'
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 0
  },
  ageUnit: {
    type: String,
    enum: ['days', 'weeks', 'months', 'years'],
    default: 'years'
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: true
  },
  neutered: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  veterinarian: {
    name: String,
    clinic: String,
    phone: String,
    email: String
  },
  medicalHistory: {
    allergies: [String],
    chronicConditions: [String],
    vaccinations: [VaccinationSchema]
  },
  currentMedications: [MedicationSchema],
  medicationHistory: [MedicationSchema],
  adverseReactions: [AdverseReactionSchema],
  appointments: [AppointmentSchema],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    expirationDate: Date
  },
  microchipId: String,
  photo: String, // URL to photo
  isActive: {
    type: Boolean,
    default: true
  },
  lastCheckup: Date,
  nextCheckup: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
PetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for pet age in human readable format
PetSchema.virtual('ageString').get(function() {
  return `${this.age} ${this.ageUnit}`;
});

// Virtual for weight with unit
PetSchema.virtual('weightString').get(function() {
  return `${this.weight} ${this.weightUnit}`;
});

// Method to add medication
PetSchema.methods.addMedication = function(medicationData) {
  this.currentMedications.push(medicationData);
  return this.save();
};

// Method to discontinue medication
PetSchema.methods.discontinueMedication = function(medicationId) {
  const medication = this.currentMedications.id(medicationId);
  if (medication) {
    medication.status = 'discontinued';
    medication.endDate = new Date();
    this.medicationHistory.push(medication.toObject());
    this.currentMedications.pull(medicationId);
  }
  return this.save();
};

// Method to add adverse reaction
PetSchema.methods.addAdverseReaction = function(reactionData) {
  this.adverseReactions.push(reactionData);
  return this.save();
};

module.exports = mongoose.model('Pet', PetSchema); 