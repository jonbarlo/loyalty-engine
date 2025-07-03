# Railway Deployment Guide

## Overview
This guide explains how to deploy your Node.js TypeScript API to Railway.

## Prerequisites
- Railway account connected to GitHub
- GitHub repository with your code
- Railway CLI (optional, for local testing)

## Step 1: Connect Repository to Railway

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `node-js-api` repository

3. **Configure Project**
   - Railway will automatically detect it's a Node.js project
   - The `railway.json` file will configure the build and deployment

## Step 2: Set Environment Variables

1. **Go to Variables Tab**
   - In your Railway project dashboard
   - Click on "Variables" tab

2. **Add Required Variables**
   Copy these from `env.railway.example`:
   ```
   NODE_ENV=production
   APP_NAME=MyNodeAPI
   VERSION=1.0.0
   PORT=3000
   JWT_SECRET=your-secure-jwt-secret
   JWT_EXPIRES_IN=24h
   ```

3. **Database Variables** (if using Railway PostgreSQL)
   ```
   DB_HOST=your-railway-postgres-host
   DB_NAME=your-railway-database-name
   DB_USERNAME=your-railway-username
   DB_PASSWORD=your-railway-password
   DB_PORT=5432
   ```

## Step 3: Add Database (Optional)

1. **Add PostgreSQL**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set the database environment variables

2. **Update Database Config**
   - Railway will inject `DATABASE_URL` environment variable
   - Your app will use this for database connection

## Step 4: Deploy

1. **Automatic Deployment**
   - Railway will automatically deploy when you push to GitHub
   - The `postinstall` script will run `npm run build`

2. **Manual Deployment**
   - Push your code to GitHub
   - Railway will detect changes and redeploy automatically

## Step 5: Verify Deployment

1. **Check Build Logs**
   - Go to "Deployments" tab in Railway
   - Check that build completed successfully

2. **Test Endpoints**
   - Your app will be available at: `https://your-app-name.railway.app`
   - Test these endpoints:
     - `GET /` - Root endpoint
     - `GET /health` - Health check
     - `GET /test` - Test endpoint

## Configuration Files

### railway.json
- Configures build and deployment settings
- Sets health check path to `/health`
- Configures restart policy

### .railwayignore
- Excludes unnecessary files from deployment
- Keeps deployment package small and secure

### package.json
- `postinstall` script runs `npm run build`
- `start` script runs the compiled app

## Troubleshooting

### Build Failures
1. Check Railway build logs
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation works locally

### Runtime Errors
1. Check Railway logs in dashboard
2. Verify environment variables are set correctly
3. Test database connection if using database

### Health Check Failures
1. Ensure `/health` endpoint returns 200
2. Check that app starts correctly
3. Verify PORT environment variable is set

## Railway vs Mochahost

| Feature | Railway | Mochahost |
|---------|---------|-----------|
| Node.js Support | ✅ Native | ❌ Limited |
| Database | ✅ PostgreSQL/MySQL | ❌ MariaDB issues |
| Deployment | ✅ Git-based | ❌ FTP required |
| Logging | ✅ Built-in | ❌ Permission issues |
| HTTPS | ✅ Automatic | ✅ Available |
| Cost | $5/month | Varies |

## Next Steps

1. **Test your deployment**
2. **Set up custom domain** (optional)
3. **Configure monitoring** (optional)
4. **Set up CI/CD** (optional)

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub Issues: [github.com/jonbarlo/node-js-api/issues](https://github.com/jonbarlo/node-js-api/issues) 