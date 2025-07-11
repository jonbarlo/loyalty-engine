import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'businesses', key: 'id' },
        onDelete: 'NO ACTION',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('customer', 'business_owner', 'admin'),
        allowNull: false,
        defaultValue: 'customer',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
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

    // Add index on email
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users');
  }
}; 