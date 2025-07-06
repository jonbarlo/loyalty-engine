import { Request, Response } from 'express';
import { CouponController } from './CouponController';
import Coupon from '../models/CouponModel';
import CustomerCoupon from '../models/CustomerCouponModel';
import User from '../models/UserModel';

// Mock the models
jest.mock('../models/CouponModel');
jest.mock('../models/CustomerCouponModel');
jest.mock('../models/UserModel');
const MockedCoupon = Coupon as jest.Mocked<typeof Coupon>;
const MockedCustomerCoupon = CustomerCoupon as jest.Mocked<typeof CustomerCoupon>;
const MockedUser = User as jest.Mocked<typeof User>;

// Mock the logger
jest.mock('../utils/logger', () => ({
  logger: jest.fn()
}));

describe('CouponController', () => {
  let mockRequest: Partial<Request> & { user?: any };
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all coupons for a business', async () => {
      const mockCoupons = [
        {
          id: 1,
          name: 'Test Coupon 1',
          discountType: 'percentage',
          discountValue: 20
        },
        {
          id: 2,
          name: 'Test Coupon 2',
          discountType: 'fixed_amount',
          discountValue: 5
        }
      ];

      MockedCoupon.findAll.mockResolvedValue(mockCoupons as any);

      mockRequest = {
        user: { businessId: 1 }
      } as any;

      await CouponController.getAll(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(MockedCoupon.findAll).toHaveBeenCalledWith({
        where: { businessId: 1 },
        order: [['createdAt', 'DESC']]
      });
      expect(mockJson).toHaveBeenCalledWith(mockCoupons);
    });

    it('should return 500 when database error occurs', async () => {
      const error = new Error('Database connection failed');
      MockedCoupon.findAll.mockRejectedValue(error);

      mockRequest = {
        user: { businessId: 1 }
      };

      await CouponController.getAll(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('create', () => {
    it('should create a new coupon successfully', async () => {
      const mockCoupon = {
        id: 1,
        name: 'Test Coupon',
        discountType: 'percentage',
        discountValue: 20,
        couponCode: 'TEST123'
      };

      MockedCoupon.create.mockResolvedValue(mockCoupon as any);

      mockRequest = {
        user: { businessId: 1 },
        body: {
          name: 'Test Coupon',
          discountType: 'percentage',
          discountValue: 20,
          startDate: '2025-01-01',
          endDate: '2025-12-31'
        }
      };

      await CouponController.create(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(MockedCoupon.create).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockCoupon);
    });

    it('should return 400 when required fields are missing', async () => {
      mockRequest = {
        user: { businessId: 1 },
        body: {
          name: 'Test Coupon'
          // Missing required fields
        }
      };

      await CouponController.create(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Name, discount type, discount value, start date, and end date are required',
        validValues: {
          discountType: ['percentage', 'fixed_amount'],
          discountValue: 'Must be a positive number'
        }
      });
    });

    it('should return 400 when discount type is invalid', async () => {
      mockRequest = {
        user: { businessId: 1 },
        body: {
          name: 'Test Coupon',
          discountType: 'invalid_type',
          discountValue: 20,
          startDate: '2025-01-01',
          endDate: '2025-12-31'
        }
      };

      await CouponController.create(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid discount type',
        validValues: ['percentage', 'fixed_amount']
      });
    });

    it('should return 400 when end date is before start date', async () => {
      mockRequest = {
        user: { businessId: 1 },
        body: {
          name: 'Test Coupon',
          discountType: 'percentage',
          discountValue: 20,
          startDate: '2025-12-31',
          endDate: '2025-01-01'
        }
      };

      await CouponController.create(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'End date must be after start date'
      });
    });
  });

  describe('getById', () => {
    it('should return coupon by ID when found', async () => {
      const mockCoupon = {
        id: 1,
        name: 'Test Coupon',
        discountType: 'percentage',
        discountValue: 20
      };

      MockedCoupon.findOne.mockResolvedValue(mockCoupon as any);

      mockRequest = {
        user: { businessId: 1 },
        params: { id: '1' }
      };

      await CouponController.getById(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(MockedCoupon.findOne).toHaveBeenCalledWith({
        where: { id: '1', businessId: 1 },
        include: expect.any(Array)
      });
      expect(mockJson).toHaveBeenCalledWith(mockCoupon);
    });

    it('should return 404 when coupon not found', async () => {
      MockedCoupon.findOne.mockResolvedValue(null);

      mockRequest = {
        user: { businessId: 1 },
        params: { id: '999' }
      };

      await CouponController.getById(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Coupon not found' });
    });
  });

  describe('update', () => {
    it('should update coupon successfully', async () => {
      const mockCoupon = {
        id: 1,
        name: 'Test Coupon',
        usedQuantity: 0,
        update: jest.fn().mockResolvedValue(true)
      };

      MockedCoupon.findOne.mockResolvedValue(mockCoupon as any);

      mockRequest = {
        user: { businessId: 1 },
        params: { id: '1' },
        body: {
          name: 'Updated Coupon',
          discountValue: 25
        }
      };

      await CouponController.update(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockCoupon.update).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockCoupon);
    });

    it('should return 400 when coupon has been used', async () => {
      const mockCoupon = {
        id: 1,
        name: 'Test Coupon',
        usedQuantity: 1
      };

      MockedCoupon.findOne.mockResolvedValue(mockCoupon as any);

      mockRequest = {
        user: { businessId: 1 },
        params: { id: '1' },
        body: {
          name: 'Updated Coupon'
        }
      };

      await CouponController.update(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Cannot update coupon that has already been used'
      });
    });
  });

  describe('delete', () => {
    it('should delete coupon successfully', async () => {
      const mockCoupon = {
        id: 1,
        name: 'Test Coupon',
        usedQuantity: 0,
        destroy: jest.fn().mockResolvedValue(true)
      };

      MockedCoupon.findOne.mockResolvedValue(mockCoupon as any);

      mockRequest = {
        user: { businessId: 1 },
        params: { id: '1' }
      };

      await CouponController.delete(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockCoupon.destroy).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({ message: 'Coupon deleted successfully' });
    });

    it('should return 400 when coupon has been used', async () => {
      const mockCoupon = {
        id: 1,
        name: 'Test Coupon',
        usedQuantity: 1
      };

      MockedCoupon.findOne.mockResolvedValue(mockCoupon as any);

      mockRequest = {
        user: { businessId: 1 },
        params: { id: '1' }
      };

      await CouponController.delete(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Cannot delete coupon that has already been used'
      });
    });
  });

  describe('getMyCoupons', () => {
    it('should return customer coupons', async () => {
      const mockCustomerCoupons = [
        {
          id: 1,
          status: 'active',
          coupon: {
            id: 1,
            name: 'Test Coupon',
            discountType: 'percentage',
            discountValue: 20
          }
        }
      ];

      MockedCustomerCoupon.findAll.mockResolvedValue(mockCustomerCoupons as any);

      mockRequest = {
        user: { userId: 1 }
      };

      await CouponController.getMyCoupons(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(MockedCustomerCoupon.findAll).toHaveBeenCalledWith({
        where: { customerId: 1 },
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      });
      expect(mockJson).toHaveBeenCalledWith(mockCustomerCoupons);
    });
  });

  describe('redeem', () => {
    it('should redeem coupon successfully', async () => {
      const mockCustomerCoupon = {
        id: 1,
        status: 'active',
        canBeRedeemed: jest.fn().mockReturnValue(true),
        markAsRedeemed: jest.fn(),
        save: jest.fn().mockResolvedValue(true),
        coupon: {
          id: 1,
          name: 'Test Coupon',
          discountType: 'percentage',
          discountValue: 20,
          canBeRedeemed: jest.fn().mockReturnValue(true),
          calculateDiscount: jest.fn().mockReturnValue(10),
          usedQuantity: 0,
          save: jest.fn().mockResolvedValue(true)
        }
      };

      MockedCustomerCoupon.findOne.mockResolvedValue(mockCustomerCoupon as any);

      mockRequest = {
        user: { userId: 1 },
        params: { id: '1' },
        body: { purchaseAmount: 50 }
      };

      await CouponController.redeem(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockCustomerCoupon.markAsRedeemed).toHaveBeenCalled();
      expect(mockCustomerCoupon.save).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Coupon redeemed successfully',
        discountAmount: 10,
        finalAmount: 40
      });
    });

    it('should return 400 when coupon cannot be redeemed', async () => {
      const mockCustomerCoupon = {
        id: 1,
        status: 'active',
        canBeRedeemed: jest.fn().mockReturnValue(false),
        isExpired: jest.fn().mockReturnValue(true),
        coupon: {
          id: 1,
          name: 'Test Coupon'
        }
      };

      MockedCustomerCoupon.findOne.mockResolvedValue(mockCustomerCoupon as any);

      mockRequest = {
        user: { userId: 1 },
        params: { id: '1' },
        body: { purchaseAmount: 50 }
      };

      await CouponController.redeem(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Coupon cannot be redeemed',
        reason: 'expired'
      });
    });
  });
}); 