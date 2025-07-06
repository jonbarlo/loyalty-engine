import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface CouponAttributes {
  id?: number;
  businessId: number;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  startDate: Date;
  endDate: Date;
  totalQuantity: number;
  usedQuantity: number;
  perCustomerLimit: number;
  isActive: boolean;
  couponCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CouponCreationAttributes extends Omit<CouponAttributes, 'id' | 'usedQuantity' | 'createdAt' | 'updatedAt'> {
  usedQuantity?: number;
}

class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
  public id!: number;
  public businessId!: number;
  public name!: string;
  public description!: string;
  public discountType!: 'percentage' | 'fixed_amount';
  public discountValue!: number;
  public minimumPurchase!: number;
  public maximumDiscount!: number;
  public startDate!: Date;
  public endDate!: Date;
  public totalQuantity!: number;
  public usedQuantity!: number;
  public perCustomerLimit!: number;
  public isActive!: boolean;
  public couponCode!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isExpired(): boolean {
    return new Date() > this.endDate;
  }

  public isActiveAndValid(): boolean {
    return this.isActive && !this.isExpired() && this.usedQuantity < this.totalQuantity;
  }

  public getAvailableQuantity(): number {
    return this.totalQuantity - this.usedQuantity;
  }

  public calculateDiscount(purchaseAmount: number): number {
    let discount = 0;

    if (this.discountType === 'percentage') {
      discount = (purchaseAmount * this.discountValue) / 100;
    } else if (this.discountType === 'fixed_amount') {
      discount = this.discountValue;
    }

    // Apply maximum discount limit if set
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }

    // Ensure discount doesn't exceed purchase amount
    if (discount > purchaseAmount) {
      discount = purchaseAmount;
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }

  public canBeRedeemed(purchaseAmount: number): boolean {
    if (!this.isActiveAndValid()) {
      return false;
    }

    if (this.minimumPurchase && purchaseAmount < this.minimumPurchase) {
      return false;
    }

    return true;
  }
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Businesses',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed_amount'),
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minimumPurchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    maximumDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    usedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    perCustomerLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    couponCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'Coupons',
    timestamps: true,
  }
);

export default Coupon; 