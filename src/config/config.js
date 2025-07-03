"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    appName: process.env.APP_NAME || 'NodeJS API',
    version: process.env.VERSION || '1.0.0',
    port: process.env.PORT || (process.env.NODE_ENV === 'production' ? 80 : 3031),
    env: process.env.NODE_ENV || 'development',
    dbUrl: process.env.DB_URL || 'nodb://localhost:???/myapp'
};
