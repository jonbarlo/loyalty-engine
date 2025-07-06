import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('CustomerCoupons', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    couponId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Coupons',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('active', 'redeemed', 'expired'),
      allowNull: false,
      defaultValue: 'active'
    },
    redeemedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });

  // Add indexes for better performance
  await queryInterface.addIndex('CustomerCoupons', ['customerId']);
  await queryInterface.addIndex('CustomerCoupons', ['couponId']);
  await queryInterface.addIndex('CustomerCoupons', ['status']);
  await queryInterface.addIndex('CustomerCoupons', ['expiresAt']);
  
  // Add unique constraint to prevent duplicate coupon assignments
  await queryInterface.addIndex('CustomerCoupons', ['customerId', 'couponId'], {
    unique: true,
    name: 'customer_coupon_unique'
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('CustomerCoupons');
} 