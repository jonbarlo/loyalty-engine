import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type RewardType = 'free_item' | 'discount' | 'custom';

interface RewardAttributes {
  id: number;
  businessId: number;
  rewardProgramId: number;
  name: string;
  description?: string;
  type: RewardType;
  value: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RewardCreationAttributes extends Optional<RewardAttributes, 'id'> {}

class Reward extends Model<RewardAttributes, RewardCreationAttributes> implements RewardAttributes {
  public id!: number;
  public businessId!: number;
  public rewardProgramId!: number;
  public name!: string;
  public description?: string;
  public type!: RewardType;
  public value!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reward.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'businesses', key: 'id' },
    },
    rewardProgramId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'reward_programs', key: 'id' },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('free_item', 'discount', 'custom'),
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
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
    modelName: 'Reward',
    tableName: 'rewards',
    timestamps: true,
  }
);

export default Reward; 