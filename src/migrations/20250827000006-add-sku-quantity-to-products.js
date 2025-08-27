"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("products");

    // Add SKU column if it doesn't exist
    if (!tableInfo.sku) {
      await queryInterface.addColumn("products", "sku", {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "categoryId",
      });
    }

    // Add quantity column if it doesn't exist
    if (!tableInfo.quantity) {
      await queryInterface.addColumn("products", "quantity", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: "price",
      });
    }

    // Update existing records to have unique SKU values if needed
    const [results] = await queryInterface.sequelize.query(`
      SELECT COUNT(*) as count FROM products WHERE sku IS NULL
    `);

    if (results[0].count > 0) {
      await queryInterface.sequelize.query(`SET @row_number = 0`);
      await queryInterface.sequelize.query(
        `UPDATE products SET sku = (@row_number:=@row_number+1000) WHERE sku IS NULL`
      );
    }

    // Make SKU NOT NULL and UNIQUE if it's not already
    if (tableInfo.sku && tableInfo.sku.allowNull) {
      await queryInterface.changeColumn("products", "sku", {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      });
    }

    // Add unique index for SKU if it doesn't exist
    try {
      await queryInterface.addIndex("products", ["sku"], {
        name: "idx_products_sku",
        unique: true,
      });
    } catch (error) {
      // Index might already exist, ignore error
      console.log("SKU index might already exist");
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove index first
    await queryInterface.removeIndex("products", "idx_products_sku");

    // Remove columns
    await queryInterface.removeColumn("products", "quantity");
    await queryInterface.removeColumn("products", "sku");
  },
};
