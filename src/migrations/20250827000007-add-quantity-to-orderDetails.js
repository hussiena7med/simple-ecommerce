"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add quantity column to orderDetails
    await queryInterface.addColumn("orderDetails", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      after: "productId",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove quantity column
    await queryInterface.removeColumn("orderDetails", "quantity");
  },
};
