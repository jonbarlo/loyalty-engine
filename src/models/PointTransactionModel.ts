import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type PointTransactionType = 'earn' | 'spend';

interface PointTransactionAttributes {
  id: number;
  userId: number;
  businessId: number;
  rewardProgramId: number;
  points: number;
  type: PointTransactionType;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PointTransactionCreationAttributes extends Optional<PointTransactionAttributes, 'id'> {}

class PointTransaction extends Model<PointTransactionAttributes, PointTransactionCreationAttributes> implements PointTransactionAttributes {
  public id!: number;
  public userId!: number;
  public businessId!: number;
  public rewardProgramId!: number;
  public points!: number;
  public type!: PointTransactionType;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PointTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
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
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('earn', 'spend'),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PointTransaction',
    tableName: 'point_transactions',
    timestamps: true,
  }
);

export default PointTransaction; 