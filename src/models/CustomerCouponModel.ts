import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface CustomerCouponAttributes {
  id?: number;
  customerId: number;
  couponId: number;
  status: 'active' | 'redeemed' | 'expired';
  redeemedAt?: Date;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  coupon?: any; // For association
}

interface CustomerCouponCreationAttributes extends Omit<CustomerCouponAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  redeemedAt?: Date;
}

class CustomerCoupon extends Model<CustomerCouponAttributes, CustomerCouponCreationAttributes> implements CustomerCouponAttributes {
  public id!: number;
  public customerId!: number;
  public couponId!: number;
  public status!: 'active' | 'redeemed' | 'expired';
  public redeemedAt!: Date;
  public expiresAt!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public canBeRedeemed(): boolean {
    return this.status === 'active' && !this.isExpired();
  }

  public markAsRedeemed(): void {
    this.status = 'redeemed';
    this.redeemedAt = new Date();
  }

  public markAsExpired(): void {
    this.status = 'expired';
  }
}

CustomerCoupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    couponId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Coupons',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'redeemed', 'expired'),
      allowNull: false,
      defaultValue: 'active',
    },
    redeemedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'CustomerCoupons',
    timestamps: true,
  }
);

export default CustomerCoupon; 