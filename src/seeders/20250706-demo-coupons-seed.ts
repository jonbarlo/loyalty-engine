import 'dotenv/config';
import '../models';
import sequelize from '../config/database';
import Business from '../models/BusinessModel';
import User from '../models/UserModel';
import Coupon from '../models/CouponModel';
import CustomerCoupon from '../models/CustomerCouponModel';

export async function seed() {
  try {
    console.log('🌱 Seeding demo coupons...');

    // Get the first business (Starbucks)
    const business = await Business.findOne({
      where: { name: 'Starbucks' }
    });

    if (!business) {
      console.log('❌ No business found. Please run business seeder first.');
      return;
    }

    const businessId = business.id;

    // Create demo coupons
    const coupons = [
      {
        businessId,
        name: 'Welcome Back!',
        description: '20% off your next purchase',
        discountType: 'percentage' as const,
        discountValue: 20,
        minimumPurchase: 5.00,
        maximumDiscount: 10.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        totalQuantity: 100,
        usedQuantity: 0,
        perCustomerLimit: 1,
        isActive: true,
        couponCode: 'WELCOME20',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId,
        name: 'Happy Hour Special',
        description: '$3 off any drink after 2 PM',
        discountType: 'fixed_amount' as const,
        discountValue: 3.00,
        minimumPurchase: 8.00,
        maximumDiscount: 3.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        totalQuantity: 50,
        usedQuantity: 0,
        perCustomerLimit: 2,
        isActive: true,
        couponCode: 'HAPPY3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId,
        name: 'Birthday Treat',
        description: 'Free pastry with any drink purchase',
        discountType: 'fixed_amount' as const,
        discountValue: 4.50,
        minimumPurchase: 4.00,
        maximumDiscount: 4.50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        totalQuantity: 200,
        usedQuantity: 0,
        perCustomerLimit: 1,
        isActive: true,
        couponCode: 'BDAYFREE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId,
        name: 'Student Discount',
        description: '15% off with valid student ID',
        discountType: 'percentage' as const,
        discountValue: 15,
        minimumPurchase: 3.00,
        maximumDiscount: 8.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        totalQuantity: 500,
        usedQuantity: 0,
        perCustomerLimit: 5,
        isActive: true,
        couponCode: 'STUDENT15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId,
        name: 'First Time Customer',
        description: '$5 off your first order',
        discountType: 'fixed_amount' as const,
        discountValue: 5.00,
        minimumPurchase: 10.00,
        maximumDiscount: 5.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        totalQuantity: 75,
        usedQuantity: 0,
        perCustomerLimit: 1,
        isActive: true,
        couponCode: 'FIRST5',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId,
        name: 'Weekend Special',
        description: '25% off on weekends',
        discountType: 'percentage' as const,
        discountValue: 25,
        minimumPurchase: 12.00,
        maximumDiscount: 15.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        totalQuantity: 30,
        usedQuantity: 0,
        perCustomerLimit: 1,
        isActive: true,
        couponCode: 'WEEKEND25',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId,
        name: 'Expired Test Coupon',
        description: 'This coupon is expired for testing',
        discountType: 'fixed_amount' as const,
        discountValue: 2.00,
        minimumPurchase: 5.00,
        maximumDiscount: 2.00,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        totalQuantity: 10,
        usedQuantity: 0,
        perCustomerLimit: 1,
        isActive: false,
        couponCode: 'EXPIRED2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        businessId,
        name: 'Inactive Test Coupon',
        description: 'This coupon is inactive for testing',
        discountType: 'percentage' as const,
        discountValue: 10,
        minimumPurchase: 5.00,
        maximumDiscount: 5.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        totalQuantity: 20,
        usedQuantity: 0,
        perCustomerLimit: 1,
        isActive: false,
        couponCode: 'INACTIVE10',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create coupons using Sequelize models
    const createdCoupons = await Coupon.bulkCreate(coupons);

    console.log(`✅ Created ${createdCoupons.length} demo coupons`);

    // Get some customers to assign coupons to
    const customers = await User.findAll({
      where: { 
        businessId: businessId,
        role: 'customer'
      },
      limit: 3
    });

    if (customers.length > 0 && createdCoupons.length > 0) {
      const customerCoupons = [];

      // Assign some coupons to customers
      for (let i = 0; i < Math.min(customers.length, 3); i++) {
        const customer = customers[i];
        if (!customer) continue;
        
        const customerId = customer.id;
        
        // Assign first 2 coupons to each customer
        for (let j = 0; j < Math.min(createdCoupons.length, 2); j++) {
          const coupon = createdCoupons[j];
          if (!coupon) continue;
          
          customerCoupons.push({
            customerId,
            couponId: coupon.id,
            status: 'active' as const,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      if (customerCoupons.length > 0) {
        await CustomerCoupon.bulkCreate(customerCoupons);
        console.log(`✅ Assigned ${customerCoupons.length} coupons to customers`);
      }
    }

    console.log('🎉 Demo coupons seeding completed!');
    console.log('\n📋 Available coupon codes for testing:');
    console.log('- WELCOME20 (20% off, min $5, max $10)');
    console.log('- HAPPY3 ($3 off, min $8)');
    console.log('- BDAYFREE ($4.50 off, min $4)');
    console.log('- STUDENT15 (15% off, min $3, max $8)');
    console.log('- FIRST5 ($5 off, min $10)');
    console.log('- WEEKEND25 (25% off, min $12, max $15)');
    console.log('- EXPIRED2 (expired coupon for testing)');
    console.log('- INACTIVE10 (inactive coupon for testing)');

  } catch (error) {
    console.error('❌ Error seeding demo coupons:', error);
    throw error;
  }
}

// For backward compatibility - allow running this file directly
if (require.main === module) {
  seed().catch((err) => {
    console.error('Seeder error:', err);
    process.exit(1);
  });
} 