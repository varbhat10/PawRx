# Security Configuration Guide

## Environment Variables Setup

### Frontend (client/.env)
```bash
# Required: Backend API URL
REACT_APP_API_BASE_URL=https://pawrx-production.up.railway.app

# Note: For local development, use:
# REACT_APP_API_BASE_URL=http://localhost:5000
```

### Backend (server/.env)
```bash
# Database - Use your MongoDB connection string
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/pawrx

# JWT Security - CRITICAL: Generate a strong secret
JWT_SECRET=your-super-secure-random-string-minimum-32-characters
JWT_EXPIRE=30d

# ML Service URL
ML_SERVICE_URL=https://your-ml-service-url.railway.app

# Email Service (Optional)
RESEND_API_KEY=your-resend-api-key-here

# Server Config
NODE_ENV=production
PORT=5000
```

### ML Service (ml/.env)
```bash
# OpenAI API Key - CRITICAL: Keep this secure
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Config
PORT=8000
ENVIRONMENT=production
```

## Railway Deployment Configuration

### 1. Backend Service Environment Variables

In your Railway backend project, set these variables:

```bash
MONGODB_URI=mongodb+srv://your-mongodb-atlas-connection-string
JWT_SECRET=your-generated-secure-jwt-secret
ML_SERVICE_URL=https://pawrx-ml-production.up.railway.app
NODE_ENV=production
PORT=5000
RESEND_API_KEY=your-resend-key-if-you-have-one
```

### 2. ML Service Environment Variables

In your Railway ML service project, set:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=8000
ENVIRONMENT=production
```

### 3. Frontend Build Environment

For production deployment, create `client/.env.production`:

```bash
REACT_APP_API_URL=https://pawrx-production.up.railway.app/api
REACT_APP_ML_URL=https://pawrx-ml-production.up.railway.app
```

## Security Best Practices Applied

### ✅ Fixed Issues:
1. **Removed hardcoded Railway URLs** from client code
2. **Environment variable usage** for all API calls
3. **Centralized API configuration** in AuthContext
4. **No secrets in source code** - all use environment variables

### ✅ Current Secure Configuration:
- All API calls use environment variables
- Demo passwords kept only for development
- JWT secrets use environment variables
- Database connections use environment variables
- OpenAI API key secured in environment

### ⚠️ Important Notes:
1. **Never commit .env files** to git
2. **Generate strong JWT secrets** (minimum 32 characters)
3. **Use different secrets** for development and production
4. **Rotate API keys regularly**
5. **Monitor API usage** for unusual activity

## Required Railway Updates

### Step 1: Update Backend Environment Variables

In your Railway backend project dashboard:

1. Go to Variables tab
2. Ensure these are set:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A strong random string (generate new one)
   - `ML_SERVICE_URL` - Your ML service Railway URL
   - `NODE_ENV=production`

### Step 2: Update Frontend Build

Since frontend uses environment variables at build time:

1. Set `REACT_APP_API_BASE_URL` in your local `.env.production`
2. Rebuild and redeploy frontend:
   ```bash
   npm run build
   npm run deploy
   ```

### Step 3: Verify ML Service

Ensure your ML service has:
- `OPENAI_API_KEY` set with your actual key
- `ENVIRONMENT=production`

## Testing Checklist

After applying these changes:

- [ ] Backend connects to database
- [ ] Authentication works (login/register)
- [ ] API calls use correct URLs
- [ ] ML service responds correctly
- [ ] No hardcoded secrets in source code
- [ ] Environment variables properly configured

## Generate Secure JWT Secret

```bash
# Method 1: OpenSSL
openssl rand -base64 64

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Method 3: Online (use reputable generator)
# Visit: https://generate-random.org/encryption-key-generator
```

## Production Deployment URLs

After configuration:
- **Frontend**: https://pawrx-frontend.up.railway.app/
- **Backend API**: https://pawrx-production.up.railway.app
- **ML Service**: https://pawrx-ml-production.up.railway.app
- **Database**: MongoDB Atlas (hidden in environment variables) 