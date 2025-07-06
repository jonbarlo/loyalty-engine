import { Request, Response, RequestHandler } from 'express';
import { Op } from 'sequelize';
import Coupon from '../models/CouponModel';
import CustomerCoupon from '../models/CustomerCouponModel';
import User from '../models/UserModel';
import Business from '../models/BusinessModel';
import { logger } from '../utils/logger';

export class CouponController {
  // Get all coupons for a business
  public static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const businessId = req.user?.businessId;
      
      const coupons = await Coupon.findAll({
        where: { businessId },
        order: [['createdAt', 'DESC']]
      });
      
      res.json(coupons);
    } catch (error) {
      logger(`Error getting coupons: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get coupon by ID
  public static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const businessId = req.user?.businessId;
      
      const coupon = await Coupon.findOne({
        where: { id, businessId },
        include: [
          {
            model: CustomerCoupon,
            as: 'customerCoupons',
            include: [
              {
                model: User,
                as: 'customer',
                attributes: ['id', 'name', 'email']
              }
            ]
          }
        ]
      });
      
      if (!coupon) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }
      
      res.json(coupon);
    } catch (error) {
      logger(`Error getting coupon by ID: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Create new coupon
  public static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const businessId = req.user?.businessId;
      const {
        name,
        description,
        discountType,
        discountValue,
        minimumPurchase,
        maximumDiscount,
        startDate,
        endDate,
        totalQuantity,
        perCustomerLimit
      } = req.body;

      // Validate required fields
      if (!name || !discountType || !discountValue || !startDate || !endDate) {
        res.status(400).json({ 
          error: 'Name, discount type, discount value, start date, and end date are required',
          validValues: {
            discountType: ['percentage', 'fixed_amount'],
            discountValue: 'Must be a positive number'
          }
        });
        return;
      }

      // Validate discount type
      if (!['percentage', 'fixed_amount'].includes(discountType)) {
        res.status(400).json({ 
          error: 'Invalid discount type',
          validValues: ['percentage', 'fixed_amount']
        });
        return;
      }

      // Validate dates
      if (new Date(endDate) <= new Date(startDate)) {
        res.status(400).json({ 
          error: 'End date must be after start date' 
        });
        return;
      }

      // Generate unique coupon code
      const couponCode = await CouponController.generateUniqueCouponCode();

      const coupon = await Coupon.create({
        businessId,
        name,
        description,
        discountType,
        discountValue,
        minimumPurchase,
        maximumDiscount,
        startDate,
        endDate,
        totalQuantity: totalQuantity || 1,
        perCustomerLimit: perCustomerLimit || 1,
        couponCode,
        isActive: true
      });

      res.status(201).json(coupon);
    } catch (error) {
      logger(`Error creating coupon: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Update coupon
  public static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const businessId = req.user?.businessId;
      
      const coupon = await Coupon.findOne({ where: { id, businessId } });
      if (!coupon) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }

      // Don't allow updates if coupon has been used
      if (coupon.usedQuantity > 0) {
        res.status(400).json({ 
          error: 'Cannot update coupon that has already been used' 
        });
        return;
      }

      const {
        name,
        description,
        discountType,
        discountValue,
        minimumPurchase,
        maximumDiscount,
        startDate,
        endDate,
        totalQuantity,
        perCustomerLimit
      } = req.body;

      // Validate dates if provided
      if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        res.status(400).json({ 
          error: 'End date must be after start date' 
        });
        return;
      }

      await coupon.update({
        name,
        description,
        discountType,
        discountValue,
        minimumPurchase,
        maximumDiscount,
        startDate,
        endDate,
        totalQuantity,
        perCustomerLimit
      });

      res.json(coupon);
    } catch (error) {
      logger(`Error updating coupon: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Delete coupon
  public static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const businessId = req.user?.businessId;
      
      const coupon = await Coupon.findOne({ where: { id, businessId } });
      if (!coupon) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }

      // Don't allow deletion if coupon has been used
      if (coupon.usedQuantity > 0) {
        res.status(400).json({ 
          error: 'Cannot delete coupon that has already been used' 
        });
        return;
      }

      await coupon.destroy();
      res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      logger(`Error deleting coupon: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Activate/Deactivate coupon
  public static toggleActive: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const businessId = req.user?.businessId;
      
      const coupon = await Coupon.findOne({ where: { id, businessId } });
      if (!coupon) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }

      coupon.isActive = !coupon.isActive;
      await coupon.save();

      res.json({ 
        message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
        isActive: coupon.isActive
      });
    } catch (error) {
      logger(`Error toggling coupon active status: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Distribute coupon to customers
  public static distribute: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { customerIds } = req.body;
      // @ts-ignore
      const businessId = req.user?.businessId;
      
      const coupon = await Coupon.findOne({ where: { id, businessId } });
      if (!coupon) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }

      if (!coupon.isActive) {
        res.status(400).json({ error: 'Cannot distribute inactive coupon' });
        return;
      }

      if (coupon.isExpired()) {
        res.status(400).json({ error: 'Cannot distribute expired coupon' });
        return;
      }

      if (coupon.getAvailableQuantity() < customerIds.length) {
        res.status(400).json({ 
          error: 'Not enough coupons available for distribution',
          available: coupon.getAvailableQuantity(),
          requested: customerIds.length
        });
        return;
      }

      const results = [];
      for (const customerId of customerIds) {
        try {
          // Check if customer already has this coupon
          const existing = await CustomerCoupon.findOne({
            where: { customerId, couponId: id }
          });

          if (existing) {
            results.push({ customerId, status: 'already_assigned' });
            continue;
          }

          // Check per customer limit
          const customerCouponCount = await CustomerCoupon.count({
            where: { customerId, couponId: id }
          });

          if (customerCouponCount >= coupon.perCustomerLimit) {
            results.push({ customerId, status: 'limit_reached' });
            continue;
          }

          // Create customer coupon
          await CustomerCoupon.create({
            customerId,
            couponId: parseInt(id as string),
            status: 'active',
            expiresAt: coupon.endDate
          });

          results.push({ customerId, status: 'assigned' });
        } catch (error) {
          results.push({ customerId, status: 'error', error: (error as Error).message });
        }
      }

      res.json({ 
        message: 'Coupon distribution completed',
        results
      });
    } catch (error) {
      logger(`Error distributing coupon: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get coupon statistics
  public static getStatistics: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const businessId = req.user?.businessId;
      
      const coupon = await Coupon.findOne({ where: { id, businessId } });
      if (!coupon) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }

      const customerCoupons = await CustomerCoupon.findAll({
        where: { couponId: id }
      });

      const stats = {
        totalAssigned: customerCoupons.length,
        active: customerCoupons.filter(cc => cc.status === 'active').length,
        redeemed: customerCoupons.filter(cc => cc.status === 'redeemed').length,
        expired: customerCoupons.filter(cc => cc.status === 'expired').length,
        availableQuantity: coupon.getAvailableQuantity(),
        isExpired: coupon.isExpired(),
        isActive: coupon.isActive
      };

      res.json(stats);
    } catch (error) {
      logger(`Error getting coupon statistics: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get customer's coupons
  public static getMyCoupons: RequestHandler = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const customerId = req.user?.userId;
      
      const customerCoupons = await CustomerCoupon.findAll({
        where: { customerId },
        include: [
          {
            model: Coupon,
            as: 'coupon',
            include: [
              {
                model: Business,
                as: 'business',
                attributes: ['id', 'name', 'logoUrl']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(customerCoupons);
    } catch (error) {
      logger(`Error getting customer coupons: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get customer's coupon history
  public static getMyCouponHistory: RequestHandler = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const customerId = req.user?.userId;
      
      const customerCoupons = await CustomerCoupon.findAll({
        where: { 
          customerId,
          status: { [Op.in]: ['redeemed', 'expired'] }
        },
        include: [
          {
            model: Coupon,
            as: 'coupon',
            include: [
              {
                model: Business,
                as: 'business',
                attributes: ['id', 'name', 'logoUrl']
              }
            ]
          }
        ],
        order: [['updatedAt', 'DESC']]
      });

      res.json(customerCoupons);
    } catch (error) {
      logger(`Error getting customer coupon history: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Redeem coupon
  public static redeem: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { purchaseAmount } = req.body;
      // @ts-ignore
      const customerId = req.user?.userId;
      
      const customerCoupon = await CustomerCoupon.findOne({
        where: { customerId, couponId: id },
        include: [
          {
            model: Coupon,
            as: 'coupon'
          }
        ]
      });

      if (!customerCoupon) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }

      if (!customerCoupon.canBeRedeemed()) {
        res.status(400).json({ 
          error: 'Coupon cannot be redeemed',
          reason: customerCoupon.isExpired() ? 'expired' : 'already_redeemed'
        });
        return;
      }

      const coupon = (customerCoupon as any).coupon;
      if (!coupon.canBeRedeemed(purchaseAmount)) {
        res.status(400).json({ 
          error: 'Coupon cannot be redeemed',
          reason: 'minimum_purchase_not_met',
          minimumPurchase: coupon.minimumPurchase
        });
        return;
      }

      // Calculate discount
      const discountAmount = coupon.calculateDiscount(purchaseAmount);

      // Mark as redeemed
      customerCoupon.markAsRedeemed();
      await customerCoupon.save();

      // Update coupon usage count
      coupon.usedQuantity += 1;
      await coupon.save();

      res.json({
        message: 'Coupon redeemed successfully',
        discountAmount,
        finalAmount: purchaseAmount - discountAmount
      });
    } catch (error) {
      logger(`Error redeeming coupon: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Helper method to generate unique coupon code
  private static async generateUniqueCouponCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let isUnique = false;

    do {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await Coupon.findOne({ where: { couponCode: code } });
      isUnique = !existing;
    } while (!isUnique);

    return code;
  }
} 