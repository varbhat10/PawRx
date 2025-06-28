# PawRx - Pet Medication Safety Platform

A full-stack web application for pet medication tracking and drug interaction monitoring. Built as a capstone project demonstrating modern web development practices and database design.

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
- **GitHub Pages** - Frontend hosting

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

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/varbhat10/PawRx.git
cd PawRx
```

2. **Install dependencies**
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install

# ML service dependencies
cd ../ml
pip install -r requirements.txt
```

3. **Environment configuration**
Create `.env` files in `server/` and `ml/` directories with required environment variables.

4. **Start services**
```bash
# Start MongoDB (if running locally)
mongod

# Start backend API (port 5000)
cd server
npm start

# Start frontend development server (port 3000)
cd client
npm start

# Start ML service (port 8000)
cd ml
uvicorn main:app --reload
```

### Demo Access
- Pet Owner Account: `user@demo.com` / `password123`
- Veterinarian Account: `vet@demo.com` / `password123`

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

The application is deployed using:
- **Frontend**: GitHub Pages for static hosting
- **Backend**: Railway platform for API services
- **Database**: MongoDB Atlas cloud database
- **ML Service**: Railway Python deployment

## Development Learnings

This project demonstrates proficiency in:
- Full-stack web development with modern JavaScript frameworks
- RESTful API design and implementation
- Database modeling and optimization
- User authentication and authorization
- Real-time data processing and validation
- Cloud deployment and DevOps practices
- Machine learning integration
- Security best practices

## Future Enhancements

- Mobile application development (React Native)
- Integration with veterinary practice management systems
- Advanced analytics and predictive modeling
- Multi-language internationalization
- Pharmacy integration for prescription management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with appropriate tests
4. Submit a pull request with detailed description

## Technical Contact

For technical questions or collaboration opportunities:
- **Email**: varbhat10@gmail.com
- **LinkedIn**: [Varun Bhat](https://linkedin.com/in/varbhat10)
- **Portfolio**: [GitHub Profile](https://github.com/varbhat10)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
