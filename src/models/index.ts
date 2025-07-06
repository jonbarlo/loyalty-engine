import './BusinessModel';
import './UserModel';
import './RewardProgramModel';
import './PunchCardModel';
import './PointTransactionModel';
import './RewardModel';
import './NotificationModel';
import './ThemeModel';
import './CouponModel';
import './CustomerCouponModel';

// Import models after they're loaded
import Business from './BusinessModel';
import User from './UserModel';
import Coupon from './CouponModel';
import CustomerCoupon from './CustomerCouponModel';

// Set up associations
Coupon.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });
Coupon.hasMany(CustomerCoupon, { foreignKey: 'couponId', as: 'customerCoupons' });

CustomerCoupon.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
CustomerCoupon.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

// Add future models here 