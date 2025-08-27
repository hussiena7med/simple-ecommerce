"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get some product IDs to create realistic order details
    const products = await queryInterface.sequelize.query(
      "SELECT id, price FROM products ORDER BY id LIMIT 10",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (products.length === 0) {
      console.log(
        "⚠️ No products found. Please run the products seeder first."
      );
      return;
    }

    const orders = [
      {
        userId: 1,
        total: 1029.98,
        status: "pending",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: 2,
        total: 149.98,
        status: "delivered",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Updated 3 days ago
      },
      {
        userId: 1,
        total: 299.99,
        status: "delivered",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        userId: 3,
        total: 79.99,
        status: "cancelled",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: 2,
        total: 449.97,
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    // Insert orders first
    const insertedOrders = await queryInterface.bulkInsert("orders", orders, {
      returning: true,
    });

    // Create order details for each order
    const orderDetails = [];

    // Order 1: iPhone + Headphones
    orderDetails.push(
      {
        orderId: 1,
        productId: products[0]?.id || 1, // iPhone
        quantity: 1,
        price: 999.99,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: 1,
        productId: products[3]?.id || 4, // Headphones
        quantity: 1,
        price: 29.99,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }
    );

    // Order 2: T-Shirts and Jeans
    orderDetails.push(
      {
        orderId: 2,
        productId: products[6]?.id || 7, // T-shirt
        quantity: 2,
        price: 24.99,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: 2,
        productId: products[5]?.id || 6, // Jeans
        quantity: 1,
        price: 79.99,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      }
    );

    // Order 3: Leather Jacket
    orderDetails.push({
      orderId: 3,
      productId: products[7]?.id || 8, // Leather Jacket
      quantity: 1,
      price: 299.99,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    });

    // Order 4: Jeans (cancelled order)
    orderDetails.push({
      orderId: 4,
      productId: products[5]?.id || 6, // Jeans
      quantity: 1,
      price: 79.99,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Order 5: Electronics bundle
    orderDetails.push(
      {
        orderId: 5,
        productId: products[3]?.id || 4, // Headphones
        quantity: 1,
        price: 349.99,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: 5,
        productId: products[2]?.id || 3, // MacBook
        quantity: 1,
        price: 99.99,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    );

    await queryInterface.bulkInsert("orderDetails", orderDetails, {});

    console.log(
      `✅ ${orders.length} orders and ${orderDetails.length} order details seeded successfully!`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("orderDetails", null, {});
    await queryInterface.bulkDelete("orders", null, {});
    console.log("✅ Orders and order details seed data removed successfully!");
  },
};
