import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('punch_cards', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'NO ACTION',
      },
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'businesses', key: 'id' },
        onDelete: 'NO ACTION',
      },
      rewardProgramId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reward_programs', key: 'id' },
        onDelete: 'NO ACTION',
      },
      punches: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      redeemed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
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
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('punch_cards');
  }
}; 