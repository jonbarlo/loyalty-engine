import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ThemeAttributes {
  id: number;
  businessId: number;
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  backgroundColor: string;
  surfaceColor?: string;
  errorColor: string;
  textPrimaryColor: string;
  textSecondaryColor?: string;
  onPrimaryColor: string;
  onSecondaryColor?: string;
  dividerColor?: string;
  appBarColor?: string;
  buttonPrimaryColor?: string;
  buttonSecondaryColor?: string;
  buttonDisabledColor?: string;
  // Fonts
  fontFamily: string;
  fontSizeBody: number;
  fontSizeHeading: number;
  fontSizeCaption?: number;
  fontWeightRegular: number;
  fontWeightBold: number;
  // Spacing
  defaultPadding: number;
  defaultMargin: number;
  borderRadius: number;
  elevation: number;
  // UI Elements
  appBarHeight?: number;
  buttonHeight?: number;
  iconSize?: number;
  // Status
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ThemeCreationAttributes extends Optional<ThemeAttributes, 'id'> {}

export type { ThemeAttributes, ThemeCreationAttributes };

class Theme extends Model<ThemeAttributes, ThemeCreationAttributes> implements ThemeAttributes {
  public id!: number;
  public businessId!: number;
  // Colors
  public primaryColor!: string;
  public secondaryColor!: string;
  public accentColor?: string;
  public backgroundColor!: string;
  public surfaceColor?: string;
  public errorColor!: string;
  public textPrimaryColor!: string;
  public textSecondaryColor?: string;
  public onPrimaryColor!: string;
  public onSecondaryColor?: string;
  public dividerColor?: string;
  public appBarColor?: string;
  public buttonPrimaryColor?: string;
  public buttonSecondaryColor?: string;
  public buttonDisabledColor?: string;
  // Fonts
  public fontFamily!: string;
  public fontSizeBody!: number;
  public fontSizeHeading!: number;
  public fontSizeCaption?: number;
  public fontWeightRegular!: number;
  public fontWeightBold!: number;
  // Spacing
  public defaultPadding!: number;
  public defaultMargin!: number;
  public borderRadius!: number;
  public elevation!: number;
  // UI Elements
  public appBarHeight?: number;
  public buttonHeight?: number;
  public iconSize?: number;
  // Status
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Theme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'businesses', key: 'id' },
    },
    // Colors
    primaryColor: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    secondaryColor: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    accentColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    backgroundColor: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    surfaceColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    errorColor: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    textPrimaryColor: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    textSecondaryColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    onPrimaryColor: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    onSecondaryColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    dividerColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    appBarColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    buttonPrimaryColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    buttonSecondaryColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    buttonDisabledColor: {
      type: DataTypes.STRING(9),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/i
      }
    },
    // Fonts
    fontFamily: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'RobotoFlex'
    },
    fontSizeBody: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 16,
      validate: {
        min: 10,
        max: 40
      }
    },
    fontSizeHeading: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 24,
      validate: {
        min: 16,
        max: 40
      }
    },
    fontSizeCaption: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 12,
      validate: {
        min: 10,
        max: 20
      }
    },
    fontWeightRegular: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 400,
      validate: {
        min: 100,
        max: 900
      }
    },
    fontWeightBold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 700,
      validate: {
        min: 100,
        max: 900
      }
    },
    // Spacing
    defaultPadding: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 16,
      validate: {
        min: 0,
        max: 64
      }
    },
    defaultMargin: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 8,
      validate: {
        min: 0,
        max: 64
      }
    },
    borderRadius: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 12,
      validate: {
        min: 0,
        max: 64
      }
    },
    elevation: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 4,
      validate: {
        min: 0,
        max: 24
      }
    },
    // UI Elements
    appBarHeight: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 56,
      validate: {
        min: 40,
        max: 120
      }
    },
    buttonHeight: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 48,
      validate: {
        min: 32,
        max: 64
      }
    },
    iconSize: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 24,
      validate: {
        min: 16,
        max: 64
      }
    },
    // Status
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    sequelize,
    modelName: 'Theme',
    tableName: 'themes',
    timestamps: true,
  }
);

export default Theme; 