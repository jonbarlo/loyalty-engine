"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
var sequelize_1 = require("sequelize");
var logger_1 = require("../utils/logger");
var config_1 = require("../config");
// Note: dotenv is already loaded in index.ts before this module is imported
// No need to load it again here
var env = config_1.config.env;
var dbConfigs = {
    development: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'nodejs_api_dev',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
        },
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    test: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME_TEST || 'nodejs_api_test',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
        },
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '1433'),
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
                enableArithAbort: true,
                requestTimeout: 30000,
                connectionTimeout: 30000,
                // Add these for better MSSQL compatibility
                useUTC: false,
                dateStrings: true,
            },
        },
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // Add retry configuration for production
        retry: {
            max: 3,
            timeout: 10000
        }
    }
};
var dbConfig = dbConfigs[env];
(0, logger_1.logger)("Environment Loaded: ".concat(config_1.config.env));
(0, logger_1.logger)("Database Dialect: ".concat(dbConfig.dialect));
(0, logger_1.logger)("Database Host: ".concat(dbConfig.host));
(0, logger_1.logger)("Database Port: ".concat(dbConfig.port));
// Debug: Log all environment variables
(0, logger_1.logger)('=== ALL ENVIRONMENT VARIABLES ===');
Object.keys(process.env).forEach(function (key) {
    if (key.includes('DB_') || key.includes('NODE_') || key.includes('APP_') || key.includes('JWT_')) {
        (0, logger_1.logger)("".concat(key, ": ").concat(process.env[key]));
    }
});
(0, logger_1.logger)('=== END ENVIRONMENT VARIABLES ===');
// Validate required configuration for production
if (env === 'production') {
    console.log('[Database Config] Validating production configuration...');
    console.log("[Database Config] DB_HOST: ".concat(dbConfig.host));
    console.log("[Database Config] DB_NAME: ".concat(dbConfig.database));
    console.log("[Database Config] DB_USERNAME: ".concat(dbConfig.username));
    console.log("[Database Config] DB_PASSWORD: ".concat(dbConfig.password ? '[SET]' : '[MISSING]'));
    console.log("[Database Config] DB_PORT: ".concat(dbConfig.port));
    if (!dbConfig.host || !dbConfig.database || !dbConfig.username || !dbConfig.password) {
        var errorMsg = "\u26A0\uFE0F Database configuration incomplete for production. Some environment variables are missing:\n    \nEnvironment Variables Status:\n- NODE_ENV: ".concat(process.env.NODE_ENV, "\n- DB_HOST: ").concat(dbConfig.host || 'undefined', "\n- DB_NAME: ").concat(dbConfig.database || 'undefined', "\n- DB_USERNAME: ").concat(dbConfig.username || 'undefined', "\n- DB_PASSWORD: ").concat(dbConfig.password ? '[SET]' : '[MISSING]', "\n- DB_PORT: ").concat(dbConfig.port, "\n\n\u26A0\uFE0F The app will start but database features will be disabled.\nTo enable database features, set the missing environment variables.\n\nCurrent working directory: ").concat(process.cwd());
        console.warn('[Database Config] Configuration Warning:', errorMsg);
        (0, logger_1.logger)(errorMsg);
    }
    else {
        console.log('[Database Config] ✅ All database environment variables are set correctly');
    }
}
exports.sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, __assign({ host: dbConfig.host, port: dbConfig.port, dialect: dbConfig.dialect, dialectOptions: dbConfig.dialectOptions, logging: dbConfig.logging, pool: dbConfig.pool }, (env === 'production' && { retry: dbConfig.retry })));
exports.default = exports.sequelize;
// Add CommonJS export for Sequelize CLI
if (typeof module !== 'undefined') {
    module.exports = dbConfigs;
}
