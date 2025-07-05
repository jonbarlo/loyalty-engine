import { Request, Response } from 'express';
import { BusinessController } from './BusinessController';
import Business from '../models/BusinessModel';

// Mock the Business model
jest.mock('../models/BusinessModel');
const MockedBusiness = Business as jest.Mocked<typeof Business>;

// Mock the logger
jest.mock('../utils/logger', () => ({
  logger: jest.fn()
}));

describe('BusinessController', () => {
  let mockRequest: Partial<Request>;
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

  describe('getPublicInfo', () => {
    it('should return public business info when business exists', async () => {
      const mockBusiness = {
        id: 1,
        name: 'Test Business',
        logoUrl: 'https://example.com/logo.png'
      };

      MockedBusiness.findByPk.mockResolvedValue(mockBusiness as any);

      mockRequest = {
        params: { id: '1' }
      };

      await BusinessController.getPublicInfo(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(MockedBusiness.findByPk).toHaveBeenCalledWith('1', {
        attributes: ['id', 'name', 'logoUrl']
      });
      expect(mockJson).toHaveBeenCalledWith(mockBusiness);
    });

    it('should return 404 when business does not exist', async () => {
      MockedBusiness.findByPk.mockResolvedValue(null);

      mockRequest = {
        params: { id: '999' }
      };

      await BusinessController.getPublicInfo(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Business not found' });
    });

    it('should return 500 when database error occurs', async () => {
      const error = new Error('Database connection failed');
      MockedBusiness.findByPk.mockRejectedValue(error);

      mockRequest = {
        params: { id: '1' }
      };

      await BusinessController.getPublicInfo(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
}); 