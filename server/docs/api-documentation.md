# PawRx API Documentation

## Overview

The PawRx API is a RESTful service that provides endpoints for pet medication management, drug interaction checking, and user authentication. All responses are in JSON format.

**Base URL:** `https://pawrx-production.up.railway.app/api`

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this consistent format:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": {}, // Response data (if applicable)
  "error": {} // Error details (if applicable)
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user", // "user" or "vet"
  "phone": "+1-555-0123", // optional
  "vetInfo": { // required if role is "vet"
    "licenseNumber": "VET12345",
    "clinic": "Animal Hospital",
    "specializations": ["Small Animals", "Surgery"]
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64b1f123e4d5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64b1f123e4d5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User

**GET** `/auth/me`

Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64b1f123e4d5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+1-555-0123",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Pet Management Endpoints

### Get All Pets

**GET** `/pets`

Retrieve all pets belonging to the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64b1f123e4d5f6789abcdef1",
      "name": "Sophie",
      "species": "cat",
      "breed": "Siamese",
      "weight": 10,
      "weightUnit": "lbs",
      "age": 5,
      "ageUnit": "years",
      "sex": "female",
      "neutered": true,
      "owner": "64b1f123e4d5f6789abcdef0",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

### Create Pet

**POST** `/pets`

Create a new pet profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Sophie",
  "species": "cat",
  "breed": "Siamese",
  "weight": 10,
  "weightUnit": "lbs",
  "age": 5,
  "ageUnit": "years",
  "sex": "female",
  "neutered": true,
  "veterinarian": {
    "name": "Dr. Smith",
    "clinic": "Pet Hospital",
    "phone": "+1-555-0456"
  },
  "medicalHistory": {
    "allergies": ["Chicken"],
    "chronicConditions": ["Diabetes"],
    "vaccinations": [
      {
        "vaccine": "FVRCP",
        "date": "2024-01-15T00:00:00.000Z",
        "nextDue": "2025-01-15T00:00:00.000Z"
      }
    ]
  }
}
```

### Get Pet Details

**GET** `/pets/:id`

Get detailed information about a specific pet.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id` (string) - Pet ID

### Update Pet

**PUT** `/pets/:id`

Update pet information.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id` (string) - Pet ID

### Delete Pet

**DELETE** `/pets/:id`

Delete a pet profile.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `id` (string) - Pet ID

---

## Medication Endpoints

### Get Pet Medications

**GET** `/medications/:petId/medications`

Get all medications for a specific pet.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `petId` (string) - Pet ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "current": [
      {
        "_id": "64b1f123e4d5f6789abcdef2",
        "name": "Carprofen",
        "brandName": "Rimadyl",
        "dosage": "75mg",
        "frequency": "twice daily",
        "route": "oral",
        "startDate": "2024-01-01T00:00:00.000Z",
        "prescribedBy": "Dr. Smith",
        "reason": "Pain management",
        "status": "active"
      }
    ],
    "history": []
  }
}
```

### Add Medication

**POST** `/medications/:petId/medications`

Add a new medication to a pet.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Carprofen",
  "brandName": "Rimadyl",
  "dosage": "75mg",
  "frequency": "twice daily",
  "route": "oral",
  "startDate": "2024-01-01T00:00:00.000Z",
  "prescribedBy": "Dr. Smith",
  "reason": "Pain management",
  "instructions": "Give with food"
}
```

---

## Drug Interaction Endpoints

### Check Drug Interactions

**POST** `/interactions/check`

Check for drug interactions among a list of medications.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "petId": "64b1f123e4d5f6789abcdef1",
  "medications": [
    {
      "name": "Carprofen",
      "dosage": "75mg"
    },
    {
      "name": "Gabapentin",
      "dosage": "100mg"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overallRisk": "low",
    "riskLevel": "green",
    "interactions": [],
    "toxicMedications": [],
    "recommendations": [
      "Continue monitoring pet for any adverse reactions",
      "Maintain current dosing schedule"
    ],
    "summary": "No significant interactions detected"
  }
}
```

### AI-Powered Analysis

**POST** `/interactions/ai-analysis`

Get AI-powered medication analysis.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "petId": "64b1f123e4d5f6789abcdef1",
  "medications": [
    {
      "name": "Carprofen",
      "dosage": "75mg"
    }
  ],
  "query": "Is this safe for a senior cat with kidney disease?"
}
```

---

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "message": "\"email\" must be a valid email"
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "message": "Pet not found"
}
```

### Server Errors (500)
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP
- **Interaction checking:** 20 requests per minute per user

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Support

For API support or questions:
- **Email:** varbhat10@gmail.com
- **Documentation:** This file
- **Status Page:** Check Railway deployment status

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- User authentication system
- Pet management functionality
- Drug interaction checking
- AI-powered analysis integration 