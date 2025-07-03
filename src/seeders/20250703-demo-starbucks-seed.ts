import 'dotenv/config';
import '../models';
import sequelize from '../config/database';
import Business from '../models/BusinessModel';
import User from '../models/UserModel';
import RewardProgram from '../models/RewardProgramModel';
import Reward from '../models/RewardModel';
import PunchCard from '../models/PunchCardModel';
import PointTransaction from '../models/PointTransactionModel';
import bcrypt from 'bcryptjs';

async function seed() {
  // await sequelize.sync(); // Removed to avoid schema conflicts

  console.log('=== ALL ENVIRONMENT VARIABLES ===');
  Object.keys(process.env).forEach(key => {
    if (key.includes('DB_') || key.includes('NODE_') || key.includes('APP_') || key.includes('JWT_')) {
      console.log(`${key}: ${process.env[key]}`);
    }
  });
  console.log('=== END ENVIRONMENT VARIABLES ===');

  // Create Starbucks business
  const business = await Business.create({
    name: 'Starbucks',
    email: 'demo@starbucks.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/sco/thumb/4/45/Starbucks_Coffee_Logo.svg/1200px-Starbucks_Coffee_Logo.svg.png',
    primaryColor: '#00704A',
    secondaryColor: '#FFFFFF',
  });

  // Create users
  const ownerPassword = await bcrypt.hash('ownerpass', 10);
  const customerPassword = await bcrypt.hash('customerpass', 10);
  const owner = await User.create({
    businessId: business.id,
    email: 'owner@starbucks.com',
    passwordHash: ownerPassword,
    name: 'Starbucks Owner',
    role: 'business_owner',
    isActive: true,
  });
  const customer = await User.create({
    businessId: business.id,
    email: 'customer@starbucks.com',
    passwordHash: customerPassword,
    name: 'Jane Customer',
    role: 'customer',
    isActive: true,
  });

  // Create reward programs
  const punchCardProgram = await RewardProgram.create({
    businessId: business.id,
    type: 'punch_card',
    name: 'Buy 10, Get 1 Free',
    description: 'Get a free drink after 10 purchases.',
    config: JSON.stringify({ punchesRequired: 10 }),
    isActive: true,
  });
  const pointsProgram = await RewardProgram.create({
    businessId: business.id,
    type: 'points',
    name: 'Starbucks Points',
    description: 'Earn 1 point per $1. 100 points = free drink.',
    config: JSON.stringify({ earnRate: 1, spendThreshold: 100 }),
    isActive: true,
  });

  // Create rewards
  await Reward.create({
    businessId: business.id,
    rewardProgramId: punchCardProgram.id,
    name: 'Free Drink',
    description: 'Any size, any drink',
    type: 'free_item',
    value: 1,
    isActive: true,
  });
  await Reward.create({
    businessId: business.id,
    rewardProgramId: pointsProgram.id,
    name: 'Free Drink (Points)',
    description: 'Redeem 100 points for a free drink',
    type: 'free_item',
    value: 1,
    isActive: true,
  });

  // Create a sample punch card and point transaction for the customer
  await PunchCard.create({
    userId: customer.id,
    businessId: business.id,
    rewardProgramId: punchCardProgram.id,
    punches: 7,
    redeemed: false,
  });
  await PointTransaction.create({
    userId: customer.id,
    businessId: business.id,
    rewardProgramId: pointsProgram.id,
    points: 45,
    type: 'earn',
    description: 'Earned from purchases',
  });

  console.log('🌱 Demo Starbucks seed data inserted successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeder error:', err);
  process.exit(1);
}); 