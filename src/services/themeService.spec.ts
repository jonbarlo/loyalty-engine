import { ThemeService } from './themeService';
import Theme from '../models/ThemeModel';

jest.mock('../models/ThemeModel');
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

describe('ThemeService', () => {
  afterEach(() => jest.clearAllMocks());

  it('should get theme by business id', async () => {
    (Theme.findOne as jest.Mock).mockResolvedValue(mockTheme);
    const theme = await ThemeService.getThemeByBusinessId(1);
    expect(theme).toEqual(mockTheme);
  });

  it('should create a new theme if not exists', async () => {
    (Theme.findOne as jest.Mock).mockResolvedValue(null);
    (Theme.create as jest.Mock).mockResolvedValue(mockTheme);
    const theme = await ThemeService.createOrUpdateTheme(1, mockTheme);
    expect(theme).toEqual(mockTheme);
  });

  it('should update existing theme', async () => {
    (Theme.findOne as jest.Mock).mockResolvedValue({ update: jest.fn().mockResolvedValue(mockTheme) });
    const theme = await ThemeService.createOrUpdateTheme(1, mockTheme);
    expect(theme).toBeDefined();
  });

  it('should throw validation error for invalid color', async () => {
    await expect(ThemeService.createOrUpdateTheme(1, { ...mockTheme, primaryColor: 'red' })).rejects.toThrow('Theme validation failed');
  });

  it('should delete theme', async () => {
    (Theme.findOne as jest.Mock).mockResolvedValue({ destroy: jest.fn() });
    const deleted = await ThemeService.deleteTheme(1);
    expect(deleted).toBe(true);
  });

  it('should return false if theme not found for delete', async () => {
    (Theme.findOne as jest.Mock).mockResolvedValue(null);
    const deleted = await ThemeService.deleteTheme(1);
    expect(deleted).toBe(false);
  });

  it('should return default theme', () => {
    const theme = ThemeService.getDefaultTheme();
    expect(theme.primaryColor).toBe('#4F46E5');
  });
}); 