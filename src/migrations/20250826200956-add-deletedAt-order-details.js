"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orderDetails", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    // Add index for better query performance
    await queryInterface.addIndex("orderDetails", ["deletedAt"], {
      name: "order_details_deleted_at",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "orderDetails",
      "order_details_deleted_at"
    );
    await queryInterface.removeColumn("orderDetails", "deletedAt");
  },
};
