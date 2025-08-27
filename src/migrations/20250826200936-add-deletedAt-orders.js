"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    // Add index for better query performance
    await queryInterface.addIndex("orders", ["deletedAt"], {
      name: "orders_deleted_at",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("orders", "orders_deleted_at");
    await queryInterface.removeColumn("orders", "deletedAt");
  },
};
