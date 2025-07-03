import 'dotenv/config';
import sequelize from '../config/database';

async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Drop all existing tables
    console.log('🗑️ Dropping all existing tables...');
    await sequelize.query('DROP TABLE IF EXISTS SequelizeMeta');
    await sequelize.query('DROP TABLE IF EXISTS notifications');
    await sequelize.query('DROP TABLE IF EXISTS rewards');
    await sequelize.query('DROP TABLE IF EXISTS point_transactions');
    await sequelize.query('DROP TABLE IF EXISTS punch_cards');
    await sequelize.query('DROP TABLE IF EXISTS users');
    await sequelize.query('DROP TABLE IF EXISTS reward_programs');
    await sequelize.query('DROP TABLE IF EXISTS businesses');
    
    // Create SequelizeMeta table for migration tracking
    console.log('📋 Creating SequelizeMeta table...');
    await sequelize.query(`
      CREATE TABLE SequelizeMeta (
        name VARCHAR(255) NOT NULL PRIMARY KEY
      )
    `);
    
    console.log('✅ Database initialized successfully!');
    console.log('💡 You can now run: npm run migrate:all');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase(); 