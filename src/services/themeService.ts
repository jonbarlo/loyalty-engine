import Theme, { ThemeCreationAttributes } from '../models/ThemeModel';
import { logger } from '../utils/logger';

export type ThemeWithoutId = Omit<ThemeCreationAttributes, 'id'>;

export class ThemeService {
  /**
   * Get theme by business ID
   */
  static async getThemeByBusinessId(businessId: number): Promise<Theme | null> {
    try {
      const theme = await Theme.findOne({
        where: { businessId, isActive: true }
      });
      return theme;
    } catch (error) {
      logger(`Error getting theme for business ${businessId}: ${error}`);
      throw error;
    }
  }

  /**
   * Create or update theme for a business
   */
  static async createOrUpdateTheme(businessId: number, themeData: ThemeWithoutId): Promise<Theme> {
    try {
      // Validate theme data
      const validationErrors = this.validateThemeData(themeData);
      if (validationErrors.length > 0) {
        throw new Error(`Theme validation failed: ${validationErrors.join(', ')}`);
      }

      // Check if theme exists
      const existingTheme = await Theme.findOne({
        where: { businessId }
      });

      if (existingTheme) {
        // Update existing theme
        await existingTheme.update(themeData);
        return existingTheme;
      } else {
        // Create new theme
        const theme = await Theme.create({
          ...themeData,
          businessId
        });
        return theme;
      }
    } catch (error) {
      logger(`Error creating/updating theme for business ${businessId}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete theme for a business
   */
  static async deleteTheme(businessId: number): Promise<boolean> {
    try {
      const theme = await Theme.findOne({
        where: { businessId }
      });

      if (!theme) {
        return false;
      }

      await theme.destroy();
      return true;
    } catch (error) {
      logger(`Error deleting theme for business ${businessId}: ${error}`);
      throw error;
    }
  }

  /**
   * Validate theme data with detailed error messages
   */
  static validateThemeData(themeData: Partial<ThemeWithoutId>): string[] {
    const errors: string[] = [];

    // Color validation
    const colorFields = [
      'primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor',
      'surfaceColor', 'errorColor', 'textPrimaryColor', 'textSecondaryColor',
      'onPrimaryColor', 'onSecondaryColor', 'dividerColor', 'appBarColor',
      'buttonPrimaryColor', 'buttonSecondaryColor', 'buttonDisabledColor'
    ];

    colorFields.forEach(field => {
      const value = themeData[field as keyof ThemeWithoutId];
      if (value !== undefined && !this.isValidHexColor(value as string)) {
        errors.push(`${field} must be a valid hex color (e.g., #FF0000 or #FFFF0000). Got: ${value}`);
      }
    });

    // Font family validation
    const supportedFonts = ['RobotoFlex', 'Poppins', 'Roboto', 'Inter', 'OpenSans', 'Lato'];
    if (themeData.fontFamily && !supportedFonts.includes(themeData.fontFamily)) {
      errors.push(`fontFamily must be one of: ${supportedFonts.join(', ')}. Got: ${themeData.fontFamily}`);
    }

    // Font size validation
    if (themeData.fontSizeBody !== undefined) {
      if (themeData.fontSizeBody < 10 || themeData.fontSizeBody > 40) {
        errors.push(`fontSizeBody must be between 10 and 40. Got: ${themeData.fontSizeBody}. Suggested: 16`);
      }
    }

    if (themeData.fontSizeHeading !== undefined) {
      if (themeData.fontSizeHeading < 16 || themeData.fontSizeHeading > 40) {
        errors.push(`fontSizeHeading must be between 16 and 40. Got: ${themeData.fontSizeHeading}. Suggested: 24`);
      }
    }

    if (themeData.fontSizeCaption !== undefined) {
      if (themeData.fontSizeCaption < 10 || themeData.fontSizeCaption > 20) {
        errors.push(`fontSizeCaption must be between 10 and 20. Got: ${themeData.fontSizeCaption}. Suggested: 12`);
      }
    }

    // Font weight validation
    if (themeData.fontWeightRegular !== undefined) {
      if (themeData.fontWeightRegular < 100 || themeData.fontWeightRegular > 900) {
        errors.push(`fontWeightRegular must be between 100 and 900. Got: ${themeData.fontWeightRegular}. Suggested: 400`);
      }
    }

    if (themeData.fontWeightBold !== undefined) {
      if (themeData.fontWeightBold < 100 || themeData.fontWeightBold > 900) {
        errors.push(`fontWeightBold must be between 100 and 900. Got: ${themeData.fontWeightBold}. Suggested: 700`);
      }
    }

    // Spacing validation
    const spacingFields = ['defaultPadding', 'defaultMargin', 'borderRadius', 'elevation'];
    spacingFields.forEach(field => {
      const value = themeData[field as keyof ThemeWithoutId];
      if (value !== undefined) {
        const numValue = value as number;
        const maxValue = field === 'elevation' ? 24 : 64;
        if (numValue < 0 || numValue > maxValue) {
          const suggested = field === 'elevation' ? 4 : field === 'defaultMargin' ? 8 : 16;
          errors.push(`${field} must be between 0 and ${maxValue}. Got: ${numValue}. Suggested: ${suggested}`);
        }
      }
    });

    // UI Elements validation
    if (themeData.appBarHeight !== undefined) {
      if (themeData.appBarHeight < 40 || themeData.appBarHeight > 120) {
        errors.push(`appBarHeight must be between 40 and 120. Got: ${themeData.appBarHeight}. Suggested: 56`);
      }
    }

    if (themeData.buttonHeight !== undefined) {
      if (themeData.buttonHeight < 32 || themeData.buttonHeight > 64) {
        errors.push(`buttonHeight must be between 32 and 64. Got: ${themeData.buttonHeight}. Suggested: 48`);
      }
    }

    if (themeData.iconSize !== undefined) {
      if (themeData.iconSize < 16 || themeData.iconSize > 64) {
        errors.push(`iconSize must be between 16 and 64. Got: ${themeData.iconSize}. Suggested: 24`);
      }
    }

    return errors;
  }

  /**
   * Check if hex color is valid
   */
  private static isValidHexColor(color: string): boolean {
    return /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/.test(color);
  }

  /**
   * Get default theme data for a business
   */
  static getDefaultTheme(): Omit<ThemeWithoutId, 'businessId'> {
    return {
      // Colors
      primaryColor: '#4F46E5',
      secondaryColor: '#6366F1',
      backgroundColor: '#FFFFFF',
      errorColor: '#EF4444',
      textPrimaryColor: '#1F2937',
      onPrimaryColor: '#FFFFFF',
      // Fonts
      fontFamily: 'RobotoFlex',
      fontSizeBody: 16,
      fontSizeHeading: 24,
      fontSizeCaption: 12,
      fontWeightRegular: 400,
      fontWeightBold: 700,
      // Spacing
      defaultPadding: 16,
      defaultMargin: 8,
      borderRadius: 12,
      elevation: 4,
      // Status
      isActive: true
    };
  }
} 