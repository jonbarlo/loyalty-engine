import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PunchCardAttributes {
  id: number;
  userId: number;
  businessId: number;
  rewardProgramId: number;
  punches: number;
  redeemed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PunchCardCreationAttributes extends Optional<PunchCardAttributes, 'id'> {}

class PunchCard extends Model<PunchCardAttributes, PunchCardCreationAttributes> implements PunchCardAttributes {
  public id!: number;
  public userId!: number;
  public businessId!: number;
  public rewardProgramId!: number;
  public punches!: number;
  public redeemed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PunchCard.init(
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
    punches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    redeemed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'PunchCard',
    tableName: 'punch_cards',
    timestamps: true,
  }
);

export default PunchCard; 