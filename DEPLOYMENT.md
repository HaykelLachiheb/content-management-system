# Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas (free tier)
- Azure account (or Render/Vercel)

## Local Development

1. Install dependencies:
   ```
   npm install
   npm run install:all
   ```

2. Create `backend/.env` from `.env.example` with your MongoDB URI

3. Run both backend + frontend:
   ```
   npm run dev
   ```

## Deploy to Azure App Service

### Backend
1. Create an Azure App Service (Node 18+ Linux)
2. Set Application Settings:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random secret
   - `SCM_DO_BUILD_DURING_DEPLOYMENT` = true
3. Deploy via Git or ZIP deploy

### Frontend
The frontend is built by the backend on Azure (static files served from `frontend/dist`).

## Environment Variables
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PORT` | Server port (default: 5000) |
