import { ThemeController } from './ThemeController';
import { ThemeService } from '../services/themeService';
import { Request, Response } from 'express';

// Mock the services
jest.mock('../services/themeService');
jest.mock('../utils/logger', () => ({
  logger: jest.fn(),
}));

const mockTheme = {
  id: 1,
  businessId: 1,
  primaryColor: '#4F46E5',
  secondaryColor: '#6366F1',
  backgroundColor: '#FFFFFF',
  errorColor: '#EF4444',
  textPrimaryColor: '#1F2937',
  onPrimaryColor: '#FFFFFF',
  fontFamily: 'RobotoFlex',
  fontSizeBody: 16,
  fontSizeHeading: 24,
  fontSizeCaption: 12,
  fontWeightRegular: 400,
  fontWeightBold: 700,
  defaultPadding: 16,
  defaultMargin: 8,
  borderRadius: 12,
  elevation: 4,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock Express request and response
const createMockRequest = (overrides: any = {}): Partial<Request> => ({
  params: {},
  body: {},
  user: {},
  ...overrides
});

const createMockResponse = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res._getStatusCode = () => res.status.mock.calls[0]?.[0] || 200;
  res._getData = () => res.json.mock.calls[0]?.[0] || {};
  return res;
};

const createMockNext = () => jest.fn();

describe('ThemeController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getTheme', () => {
    it('should return theme for a business', async () => {
      (ThemeService.getThemeByBusinessId as jest.Mock).mockResolvedValue(mockTheme);
      const req = createMockRequest({ params: { id: '1' } }) as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.getTheme(req, res, next);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual(mockTheme);
    });

    it('should return 404 if theme not found', async () => {
      (ThemeService.getThemeByBusinessId as jest.Mock).mockResolvedValue(null);
      const req = createMockRequest({ params: { id: '1' } }) as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.getTheme(req, res, next);
      expect(res._getStatusCode()).toBe(404);
    });
  });

  describe('createOrUpdateTheme', () => {
    it('should create or update theme for admin', async () => {
      (ThemeService.createOrUpdateTheme as jest.Mock).mockResolvedValue(mockTheme);
      const req = createMockRequest({ 
        params: { id: '1' }, 
        body: mockTheme, 
        user: { role: 'admin', businessId: 1 } 
      }) as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.createOrUpdateTheme(req, res, next);
      expect(res._getStatusCode()).toBe(201);
      expect(res._getData().message).toBe('Theme created/updated successfully');
    });

    it('should return 403 for non-admin/non-owner', async () => {
      const req = createMockRequest({ 
        params: { id: '1' }, 
        body: mockTheme, 
        user: { role: 'customer', businessId: 1 } 
      }) as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.createOrUpdateTheme(req, res, next);
      expect(res._getStatusCode()).toBe(403);
    });
  });

  describe('updateTheme', () => {
    it('should update theme for admin', async () => {
      (ThemeService.createOrUpdateTheme as jest.Mock).mockResolvedValue(mockTheme);
      const req = createMockRequest({ 
        params: { id: '1' }, 
        body: mockTheme, 
        user: { role: 'admin', businessId: 1 } 
      }) as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.updateTheme(req, res, next);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData().message).toBe('Theme updated successfully');
    });
  });

  describe('deleteTheme', () => {
    it('should delete theme for admin', async () => {
      (ThemeService.deleteTheme as jest.Mock).mockResolvedValue(true);
      const req = createMockRequest({ 
        params: { id: '1' }, 
        user: { role: 'admin', businessId: 1 } 
      }) as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.deleteTheme(req, res, next);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData().message).toBe('Theme deleted successfully');
    });

    it('should return 404 if theme not found', async () => {
      (ThemeService.deleteTheme as jest.Mock).mockResolvedValue(false);
      const req = createMockRequest({ 
        params: { id: '1' }, 
        user: { role: 'admin', businessId: 1 } 
      }) as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.deleteTheme(req, res, next);
      expect(res._getStatusCode()).toBe(404);
    });
  });

  describe('getDefaultTheme', () => {
    it('should return default theme template', async () => {
      const req = createMockRequest() as Request;
      const res = createMockResponse();
      const next = createMockNext();
      await ThemeController.getDefaultTheme(req, res, next);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData().message).toBe('Default theme template');
    });
  });
}); 