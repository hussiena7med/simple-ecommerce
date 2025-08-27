"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Clothing & Fashion",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Home & Garden",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sports & Outdoors",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Books & Education",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Health & Beauty",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Toys & Games",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Automotive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Food & Beverages",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Office Supplies",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("categories", categories, {});

    console.log("✅ Categories seeded successfully!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
    console.log("✅ Categories seed data removed successfully!");
  },
};
