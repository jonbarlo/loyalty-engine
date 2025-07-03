import 'dotenv/config';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { sync as globSync } from 'glob';
import sequelize from '../config/database';
import fs from 'fs';

const migrationPattern = path.resolve(__dirname, '../migrations/*.ts').replace(/\\/g, '/');
console.log('[Umzug] Migration glob pattern:', migrationPattern);
const migrationsDir = path.resolve(__dirname, '../migrations');
console.log('[Umzug] Contents of migrations directory:', fs.readdirSync(migrationsDir));
const migrationFiles = globSync(migrationPattern);
console.log('[Umzug] Migration files found:', migrationFiles);

const umzug = new Umzug({
  migrations: {
    glob: migrationPattern,
    resolve: ({ name, path, context }) => {
      const migration = require(path!);
      // Support both default and named exports
      const migrationObj = migration.default || migration;
      return {
        name,
        up: async () => {
          console.log(`[Umzug] Running migration: ${name}`);
          await migrationObj.up(context);
        },
        down: async () => {
          console.log(`[Umzug] Reverting migration: ${name}`);
          await migrationObj.down(context);
        },
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
  try {
    console.log('Running all migrations...');
    await umzug.up();
    console.log('All migrations executed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
})(); 