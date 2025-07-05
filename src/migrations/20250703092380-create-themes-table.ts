import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('themes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'businesses', key: 'id' },
        onDelete: 'NO ACTION',
      },
      // Colors
      primaryColor: {
        type: DataTypes.STRING(9), // #RRGGBB or #AARRGGBB
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      }
    });

    // Add indexes
    await queryInterface.addIndex('themes', ['businessId'], {
      unique: true,
      name: 'themes_businessId_unique'
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('themes');
  }
}; 