import { Router } from 'express';
import { CouponController } from '../controllers/CouponController';
import { authenticateToken } from '../middleware/auth';

const couponRouter = Router();

// Business endpoints (protected)
couponRouter.get('/coupons', authenticateToken, CouponController.getAll);
couponRouter.post('/coupons', authenticateToken, CouponController.create);
couponRouter.get('/coupons/:id', authenticateToken, CouponController.getById);
couponRouter.put('/coupons/:id', authenticateToken, CouponController.update);
couponRouter.delete('/coupons/:id', authenticateToken, CouponController.delete);
couponRouter.post('/coupons/:id/toggle-active', authenticateToken, CouponController.toggleActive);
couponRouter.post('/coupons/:id/distribute', authenticateToken, CouponController.distribute);
couponRouter.get('/coupons/:id/statistics', authenticateToken, CouponController.getStatistics);

// Customer endpoints (protected)
couponRouter.get('/my-coupons', authenticateToken, CouponController.getMyCoupons);
couponRouter.get('/my-coupons/history', authenticateToken, CouponController.getMyCouponHistory);
couponRouter.post('/coupons/:id/redeem', authenticateToken, CouponController.redeem);

// Remove public coupon validation endpoint
// couponRouter.get('/public/coupons/:code/validate', CouponController.validateCouponCode);

export default couponRouter; 