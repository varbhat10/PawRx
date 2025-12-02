# PawRx - Pet Medication Safety Platform

A full-stack web application for pet medication tracking and drug interaction monitoring. Initially build for personal use, evolving into a public product.

## Overview

PawRx addresses the critical need for pet medication safety by providing a centralized platform for tracking medications, monitoring drug interactions, and maintaining comprehensive pet health records. The application serves both pet owners and veterinary professionals with role-based features and real-time safety alerts.

## Core Features

**Pet Management**
- Comprehensive pet profiles with medical history
- Multi-pet household support
- Breed-specific safety considerations

**Medication Tracking**
- Current medication management with dosage tracking
- Historical medication records
- Adverse reaction logging and monitoring

**Safety Monitoring**
- Real-time drug interaction checking
- Species-specific toxicity warnings
- Dosage validation and alerts

**Analytics and Reporting**
- Visual dashboard with health metrics
- PDF report generation for veterinary visits
- Medication adherence tracking

**User Roles**
- Pet Owner: Personal pet management and safety monitoring
- Veterinarian: Professional dashboard with patient management tools

## Technical Architecture

### Frontend
- **React 18** - Component-based user interface
- **Tailwind CSS** - Responsive design system
- **React Router** - Client-side navigation
- **Context API** - State management
- **Chart.js** - Data visualization

### Backend
- **Node.js/Express** - RESTful API server
- **MongoDB** - Document database with Mongoose ODM
- **JWT** - Authentication and authorization
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Machine Learning Service
- **Python FastAPI** - ML API service
- **OpenAI API** - Natural language processing for medication analysis
- **Custom algorithms** - Drug interaction detection

### Infrastructure
- **Docker** - Containerization
- **Railway** - Cloud deployment
- **Static Hosting** - Frontend hosting

## Project Structure

```
pawrx/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views
│   │   ├── context/        # React context providers
│   │   └── data/           # Static data and constants
│   └── package.json
├── server/                 # Node.js backend API
│   ├── models/             # MongoDB data models
│   ├── routes/             # API endpoint handlers
│   ├── middleware/         # Custom middleware functions
│   └── utils/              # Helper utilities
├── ml/                     # Python ML service
│   ├── main.py             # FastAPI application
│   └── requirements.txt
├── data/                   # Sample data and database seeds
└── docker/                 # Docker configuration files
```


### Demo Access
- Populate demo login credentials by clicking Pet Owner Demo button on login screen. 
## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Retrieve current user profile
- `POST /api/auth/logout` - End user session

### Pet Management
- `GET /api/pets` - List user's pets
- `POST /api/pets` - Create new pet profile
- `GET /api/pets/:id` - Retrieve specific pet details
- `PUT /api/pets/:id` - Update pet information
- `DELETE /api/pets/:id` - Remove pet profile

### Medication Management
- `GET /api/medications/:petId/medications` - Get pet's medications
- `POST /api/medications/:petId/medications` - Add new medication
- `PUT /api/medications/:petId/medications/:id` - Update medication
- `DELETE /api/medications/:petId/medications/:id` - Remove medication

### Drug Interaction Checking
- `POST /api/interactions/check` - Analyze medication combinations
- `POST /api/interactions/ai-analysis` - AI-powered safety analysis

## Database Design

The application uses MongoDB with the following key collections:

- **Users** - Authentication and profile information
- **Pets** - Pet profiles and basic information
- **Medications** - Current and historical medication records
- **Interactions** - Drug interaction data and safety rules
- **Reactions** - Adverse reaction logging

## Security Implementation

- JWT-based authentication with secure token handling
- Password hashing using bcrypt
- Request rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Environment variable protection for sensitive data

## Testing Strategy

```bash
# Backend API tests
cd server
npm test

# Frontend component tests
cd client
npm test

# ML service tests
cd ml
python -m pytest
```

## Deployment

- **Frontend**: Static hosting for frontend assets
- **Backend**: Railway platform for API services
- **Database**: MongoDB Atlas cloud database
- **ML Service**: Railway Python deployment


## License

This project is proprietary software. All rights reserved.
