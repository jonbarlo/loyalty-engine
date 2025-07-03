import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type RewardProgramType = 'punch_card' | 'points';

interface RewardProgramAttributes {
  id: number;
  businessId: number;
  type: RewardProgramType;
  name: string;
  description?: string;
  config: string; // Store as string in database
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RewardProgramCreationAttributes extends Optional<RewardProgramAttributes, 'id'> {}

class RewardProgram extends Model<RewardProgramAttributes, RewardProgramCreationAttributes> implements RewardProgramAttributes {
  public id!: number;
  public businessId!: number;
  public type!: RewardProgramType;
  public name!: string;
  public description?: string;
  public config!: string; // Store as string in database
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Getter for config - converts TEXT to object
  get configData(): object {
    try {
      return JSON.parse(this.config);
    } catch (error) {
      console.error('Error parsing config JSON:', error);
      return {};
    }
  }

  // Setter for config - converts object to TEXT
  set configData(value: object) {
    this.config = JSON.stringify(value);
  }
}

RewardProgram.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'businesses', key: 'id' },
    },
    type: {
      type: DataTypes.ENUM('punch_card', 'points'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    config: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'RewardProgram',
    tableName: 'reward_programs',
    timestamps: true,
  }
);

export default RewardProgram; 