import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type RewardProgramType = 'punch_card' | 'points';

interface RewardProgramAttributes {
  id: number;
  businessId: number;
  type: RewardProgramType;
  name: string;
  description?: string;
  config: object;
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
  public config!: object;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      type: DataTypes.JSON,
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