# Mochahost IIS Node.js Deployment Guide

This guide explains how to deploy your Node.js API to Mochahost shared IIS hosting using iisnode, with the correct web.config and environment variable setup.

## Key Points
- Mochahost uses IIS with iisnode to run Node.js apps.
- You must use a custom `web.config` for full control.
- Environment variables can be set via `.env` file in your app root.
- Logging must be disabled in iisnode to avoid permission errors.

## 1. web.config Example (Working)

Place this file in your app root:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <!-- Disable logging to avoid permission errors, enable dev errors for debugging -->
    <iisnode loggingEnabled="false" devErrorsEnabled="true" nodeProcessCommandLine="C:\Program Files\nodejs\node.exe"/>
    <!-- Register iisnode handler -->
    <handlers>
      <add name="iisnode" path="*.js" verb="*" modules="iisnode"/>
    </handlers>
    <!-- Rewrite rule - all requests go to main app entry point -->
    <rewrite>
      <rules>
        <rule name="MainApp">
          <action type="Rewrite" url="dist/index.js"/>
        </rule>
      </rules>
    </rewrite>
    <tracing>
      <traceFailedRequests>
        <clear/>
      </traceFailedRequests>
    </tracing>
  </system.webServer>
</configuration>
```

- This routes all requests to your main app (`dist/index.js`).
- Disables iisnode logging (fixes permission errors).
- Enables dev errors for easier debugging.
- Ensures the correct Node.js binary is used.

## 2. Environment Variables

**Recommended:** Use a `.env` file in your app root (same directory as `web.config`). Example:

```
NODE_ENV=production
DB_HOST=mssql001.use1.my-hosting-panel.com
DB_NAME=506software-mssqlserverdb-test
DB_USERNAME=defaultUser
DB_PASSWORD=your-password
DB_PORT=1433
APP_NAME=NodeJS-API-Production
VERSION=1.0.0
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
```

- Do **not** commit `.env` to version control.
- Mochahost will load this file if your app uses `dotenv`.

## 3. Deployment Steps

1. **Build your app:**
   ```bash
   npm run build
   ```
2. **Upload to Mochahost:**
   - Upload the `dist/` folder
   - Upload `web.config`, `.env`, `package.json`, `package-lock.json`
3. **Install dependencies on the server:**
   ```bash
   npm install --production
   ```
4. **Restart the app in Plesk or IIS**
5. **Test your endpoints:**
   - `/` (root)
   - `/health`
   - `/test`
   - `/auth/login` (POST)

## 4. Troubleshooting

- If you see 500 errors and no logs, check that `loggingEnabled="false"` in `web.config`.
- If only `/` and `/health` work, make sure you are deploying the latest build and that `dist/index.js` is your main entry point.
- If environment variables are missing, check your `.env` file and ensure it is in the app root.
- If you get permission errors, contact Mochahost support and ask them to ensure the IIS application pool identity has read/write access to your app directory.

## 5. Security Notes
- Never commit `.env` files to version control.
- Use strong, unique passwords for database and JWT secrets.
- Regularly rotate secrets and credentials.

---

**This guide reflects the current, working Mochahost IIS Node.js deployment process as confirmed by support.** 