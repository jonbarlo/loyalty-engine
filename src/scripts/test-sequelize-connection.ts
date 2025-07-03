import 'dotenv/config';
import sequelize from '../config/database';

console.log('DB_USER:', process.env.DB_USERNAME);
console.log('DB_PASS:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize connection OK');
    process.exit(0);
  } catch (err) {
    console.error('❌ Sequelize connection error:', err);
    process.exit(1);
  }
})(); 