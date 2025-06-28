const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  drug1: {
    type: String,
    required: true,
    index: true
  },
  drug2: {
    type: String,
    required: true,
    index: true
  },
  species: {
    type: [String],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'ferret', 'all'],
    default: ['all']
  },
  interactionType: {
    type: String,
    enum: ['drug-drug', 'drug-food', 'drug-condition'],
    default: 'drug-drug'
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'major', 'contraindicated'],
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  mechanism: {
    type: String,
    required: true
  },
  clinicalEffects: [String],
  management: {
    type: String,
    required: true
  },
  alternatives: [String],
  monitoringRequired: {
    type: Boolean,
    default: false
  },
  monitoringParameters: [String],
  onsetTime: String,
  duration: String,
  evidenceLevel: {
    type: String,
    enum: ['theoretical', 'case-report', 'study', 'established'],
    default: 'theoretical'
  },
  references: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient interaction lookups
InteractionSchema.index({ drug1: 1, drug2: 1 });
InteractionSchema.index({ severity: 1, riskLevel: 1 });

// Update timestamp on save
InteractionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find interactions for a list of drugs
InteractionSchema.statics.findInteractionsForDrugs = async function(drugs, species = 'all') {
  const interactions = [];
  
  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const drug1 = drugs[i].toLowerCase();
      const drug2 = drugs[j].toLowerCase();
      
      const interaction = await this.findOne({
        $or: [
          { drug1: drug1, drug2: drug2 },
          { drug1: drug2, drug2: drug1 }
        ],
        $or: [
          { species: 'all' },
          { species: species }
        ],
        isActive: true
      });
      
      if (interaction) {
        interactions.push(interaction);
      }
    }
  }
  
  return interactions;
};

// Static method to check if a drug is toxic for a species
InteractionSchema.statics.checkToxicity = async function(drugName, species) {
  return await this.findOne({
    drug1: drugName.toLowerCase(),
    drug2: 'toxic',
    $or: [
      { species: 'all' },
      { species: species }
    ],
    isActive: true
  });
};

module.exports = mongoose.model('Interaction', InteractionSchema); 