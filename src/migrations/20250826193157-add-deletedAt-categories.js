"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("categories", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    // Add index for deletedAt to optimize soft delete queries
    await queryInterface.addIndex("categories", ["deletedAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("categories", "deletedAt");
  },
};
