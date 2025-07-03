import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BusinessAttributes {
  id: number;
  name: string;
  email: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BusinessCreationAttributes extends Optional<BusinessAttributes, 'id'> {}

class Business extends Model<BusinessAttributes, BusinessCreationAttributes> implements BusinessAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public logoUrl?: string;
  public primaryColor?: string;
  public secondaryColor?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Business.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Business',
    tableName: 'businesses',
    timestamps: true,
  }
);

export default Business; 