# PawRx Database Schema

## Overview

PawRx uses MongoDB as its primary database, implementing a document-based NoSQL architecture. The schema is designed to efficiently handle pet health records, medication tracking, and user management while maintaining data integrity and supporting complex queries.

## Database Structure

### Collections

1. **users** - User authentication and profile information
2. **pets** - Pet profiles and medical information
3. **interactions** - Drug interaction rules and safety data

---

## User Collection

**Collection:** `users`

**Purpose:** Stores user account information for both pet owners and veterinarians.

```javascript
{
  _id: ObjectId,
  name: String, // Required, 2-50 characters
  email: String, // Required, unique, valid email format
  password: String, // Required, hashed with bcrypt, min 6 characters
  role: String, // Required, enum: ['user', 'vet'], default: 'user'
  phone: String, // Optional, max 20 characters
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  vetInfo: { // Only for veterinarians
    licenseNumber: String, // Sparse index for uniqueness
    clinic: String,
    specializations: [String] // Array of specialization areas
  },
  isActive: Boolean, // Default: true, for soft deletion
  createdAt: Date, // Auto-generated
  updatedAt: Date // Auto-generated
}
```

**Indexes:**
- `email`: Unique index for authentication
- `vetInfo.licenseNumber`: Sparse unique index for vet validation
- `role`: Index for role-based queries

**Security Features:**
- Passwords hashed using bcrypt with salt rounds
- Email validation using regex pattern
- Role-based access control implementation

---

## Pet Collection

**Collection:** `pets`

**Purpose:** Comprehensive pet profiles including medical history and current medications.

```javascript
{
  _id: ObjectId,
  name: String, // Required, 1-50 characters
  species: String, // Required, enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'ferret', 'other']
  breed: String, // Optional, max 50 characters
  weight: Number, // Required, positive number
  weightUnit: String, // enum: ['kg', 'lbs'], default: 'kg'
  age: Number, // Required, positive number
  ageUnit: String, // enum: ['days', 'weeks', 'months', 'years'], default: 'years'
  sex: String, // Required, enum: ['male', 'female', 'unknown']
  neutered: Boolean, // Default: false
  owner: ObjectId, // Required, references users collection
  
  veterinarian: {
    name: String,
    clinic: String,
    phone: String,
    email: String // Valid email format
  },
  
  medicalHistory: {
    allergies: [String], // Array of known allergies
    chronicConditions: [String], // Long-term health conditions
    vaccinations: [{
      vaccine: String, // Required
      date: Date, // Required, vaccination date
      nextDue: Date, // Optional, next vaccination due
      veterinarian: String, // Who administered
      batchNumber: String // Vaccine batch for tracking
    }]
  },
  
  currentMedications: [{
    _id: ObjectId, // Auto-generated for medication tracking
    name: String, // Required, medication name
    brandName: String, // Optional, brand/trade name
    dosage: String, // Required, dosage amount
    frequency: String, // Required, how often to administer
    route: String, // enum: ['oral', 'topical', 'injection', 'inhalation', 'other'], default: 'oral'
    startDate: Date, // Required, when medication started
    endDate: Date, // Optional, when to stop (null for ongoing)
    prescribedBy: String, // Veterinarian who prescribed
    reason: String, // Why this medication was prescribed
    instructions: String, // Special administration instructions
    status: String, // enum: ['active', 'completed', 'discontinued'], default: 'active'
    createdAt: Date, // Auto-generated
    updatedAt: Date // Auto-generated
  }],
  
  medicationHistory: [{
    // Same structure as currentMedications
    // For completed/discontinued medications
  }],
  
  adverseReactions: [{
    _id: ObjectId,
    medication: String, // Required, which medication caused reaction
    date: Date, // Required, when reaction occurred
    severity: String, // Required, enum: ['mild', 'moderate', 'severe', 'life-threatening']
    symptoms: [String], // Required, array of observed symptoms
    duration: String, // How long reaction lasted
    treatment: String, // What treatment was given
    outcome: String, // enum: ['recovered', 'recovering', 'ongoing', 'fatal'], default: 'recovered'
    reportedBy: String, // Who reported the reaction
    notes: String, // Additional notes
    createdAt: Date
  }],
  
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String // e.g., "Family member", "Neighbor"
  },
  
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    expirationDate: Date
  },
  
  microchipId: String, // Unique identifier if microchipped
  photo: String, // URL to pet photo
  lastCheckup: Date, // Last veterinary visit
  nextCheckup: Date, // Scheduled next visit
  
  createdAt: Date, // Auto-generated
  updatedAt: Date // Auto-generated
}
```

**Indexes:**
- `owner`: Index for efficient user-pet queries
- `species`: Index for species-specific operations
- `currentMedications.name`: Index for medication searches
- `microchipId`: Sparse unique index for microchip lookups

**Business Logic:**
- Automatic medication history management when medications are discontinued
- Adverse reaction tracking with severity escalation
- Vaccination schedule management with due date calculations

---

## Interaction Collection

**Collection:** `interactions`

**Purpose:** Drug interaction rules and safety data for medication compatibility checking.

```javascript
{
  _id: ObjectId,
  drug1: String, // Required, first medication name
  drug2: String, // Required, second medication name
  species: [String], // Array of affected species, ['all'] for universal
  
  interactionType: String, // Required, enum: ['contraindicated', 'major', 'moderate', 'minor']
  severity: String, // Required, enum: ['critical', 'high', 'medium', 'low']
  
  description: String, // Required, explanation of the interaction
  mechanism: String, // How the interaction occurs
  clinicalEffect: String, // What happens when drugs interact
  
  recommendations: {
    action: String, // Required, what to do
    monitoring: String, // What to monitor for
    alternatives: [String] // Alternative medication suggestions
  },
  
  evidenceLevel: String, // enum: ['established', 'probable', 'possible', 'theoretical']
  sources: [String], // References to scientific literature
  
  metadata: {
    createdBy: String, // Who added this interaction
    reviewedBy: String, // Who verified the information
    lastReviewed: Date, // When last reviewed for accuracy
    version: Number // Version control for updates
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `drug1, drug2`: Compound index for fast interaction lookups
- `species`: Index for species-specific queries
- `severity`: Index for filtering by risk level

---

## Database Relationships

### One-to-Many Relationships

1. **User → Pets**
   - One user can own multiple pets
   - Foreign key: `pets.owner` → `users._id`

2. **Pet → Medications**
   - One pet can have multiple current and historical medications
   - Embedded documents in `pets.currentMedications` and `pets.medicationHistory`

3. **Pet → Adverse Reactions**
   - One pet can have multiple adverse reactions
   - Embedded documents in `pets.adverseReactions`

### Many-to-Many Relationships

1. **Medications ↔ Interactions**
   - Any medication can interact with multiple other medications
   - Implemented through dynamic queries on `interactions` collection

---

## Data Validation

### Mongoose Schema Validation

```javascript
// Example validation rules
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
});
```

### Application-Level Validation

- **Joi validation** for API request validation
- **Business rule validation** in middleware
- **Data sanitization** before database operations

---

## Performance Optimizations

### Indexing Strategy

1. **Primary Indexes**: All collections have default `_id` indexes
2. **Query Indexes**: Indexes on frequently queried fields
3. **Compound Indexes**: For complex multi-field queries
4. **Sparse Indexes**: For optional unique fields like microchip IDs

### Query Optimization

1. **Projection**: Only fetching required fields
2. **Pagination**: Limiting result sets with skip/limit
3. **Aggregation**: Using MongoDB aggregation pipeline for complex queries
4. **Connection Pooling**: Efficient database connection management

### Caching Strategy

1. **Application-level caching** for frequently accessed data
2. **Query result caching** for expensive operations
3. **Static data caching** for medication databases

---

## Data Security

### Encryption

- **Password hashing**: bcrypt with salt rounds
- **Sensitive data**: Additional encryption for medical records
- **Transport security**: All connections use TLS

### Access Control

- **Authentication**: JWT-based token authentication
- **Authorization**: Role-based access control (RBAC)
- **Data ownership**: Users can only access their own pets' data
- **Veterinarian access**: Special permissions for vet users

### Audit Trail

- **Change tracking**: CreatedAt/UpdatedAt timestamps
- **User actions**: Logging critical operations
- **Data retention**: Policies for historical data management

---

## Backup and Recovery

### Backup Strategy

1. **Daily automated backups** to cloud storage
2. **Point-in-time recovery** capability
3. **Geographic redundancy** for disaster recovery

### Data Integrity

1. **Schema validation** at multiple levels
2. **Referential integrity** checks
3. **Data consistency** monitoring

---

## Migration Strategy

### Schema Evolution

1. **Versioned migrations** for schema changes
2. **Backward compatibility** during transitions
3. **Data transformation** scripts for major changes

### Deployment

1. **Blue-green deployments** for zero downtime
2. **Database migration testing** in staging environments
3. **Rollback procedures** for failed migrations

---

## Analytics and Reporting

### Data Aggregation

```javascript
// Example: Medication usage analytics
db.pets.aggregate([
  { $unwind: "$currentMedications" },
  { $group: { 
    _id: "$currentMedications.name",
    count: { $sum: 1 },
    species: { $addToSet: "$species" }
  }},
  { $sort: { count: -1 }}
]);
```

### Key Metrics

1. **User engagement**: Active users, pet registrations
2. **Safety metrics**: Interaction checks, adverse reactions
3. **System performance**: Response times, error rates

---

This schema design supports scalability, data integrity, and efficient querying while maintaining the flexibility needed for veterinary data management. 