"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, get the category IDs to use as foreign keys
    const categories = await queryInterface.sequelize.query(
      "SELECT id, name FROM categories ORDER BY id",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create a mapping of category names to IDs
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat.id;
    });

    const products = [
      // Electronics (assuming category ID 1)
      {
        categoryId: categoryMap["Electronics"],
        sku: 10001,
        name: "iPhone 15 Pro",
        description:
          "Latest Apple iPhone with advanced camera system and A17 Pro chip",
        price: 999.99,
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Electronics"],
        sku: 10002,
        name: "Samsung Galaxy S24",
        description: "Premium Android smartphone with AI-powered features",
        price: 899.99,
        quantity: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Electronics"],
        sku: 10003,
        name: "MacBook Pro 14-inch",
        description:
          "Apple MacBook Pro with M3 chip, perfect for professionals",
        price: 1999.99,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Electronics"],
        sku: 10004,
        name: "Sony WH-1000XM5 Headphones",
        description: "Industry-leading noise canceling wireless headphones",
        price: 349.99,
        quantity: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Electronics"],
        sku: 10005,
        name: "iPad Air",
        description: "Powerful and versatile iPad with M1 chip",
        price: 599.99,
        quantity: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Clothing & Fashion
      {
        categoryId: categoryMap["Clothing & Fashion"],
        sku: 20001,
        name: "Classic Denim Jeans",
        description: "High-quality straight-fit denim jeans",
        price: 79.99,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Clothing & Fashion"],
        sku: 20002,
        name: "Cotton T-Shirt",
        description:
          "Comfortable 100% cotton t-shirt, available in multiple colors",
        price: 24.99,
        quantity: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Clothing & Fashion"],
        sku: 20003,
        name: "Leather Jacket",
        description: "Genuine leather jacket with classic styling",
        price: 299.99,
        quantity: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Clothing & Fashion"],
        sku: 20004,
        name: "Running Shoes",
        description: "Lightweight running shoes with excellent cushioning",
        price: 129.99,
        quantity: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Home & Garden
      {
        categoryId: categoryMap["Home & Garden"],
        sku: 30001,
        name: "Coffee Maker",
        description: "Programmable drip coffee maker with thermal carafe",
        price: 89.99,
        quantity: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Home & Garden"],
        sku: 30002,
        name: "Garden Tool Set",
        description: "Complete 10-piece garden tool set with carrying case",
        price: 59.99,
        quantity: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Home & Garden"],
        sku: 30003,
        name: "Table Lamp",
        description: "Modern LED table lamp with adjustable brightness",
        price: 49.99,
        quantity: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Sports & Outdoors
      {
        categoryId: categoryMap["Sports & Outdoors"],
        sku: 40001,
        name: "Yoga Mat",
        description: "Non-slip exercise yoga mat with carrying strap",
        price: 34.99,
        quantity: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Sports & Outdoors"],
        sku: 40002,
        name: "Basketball",
        description: "Official size and weight basketball",
        price: 29.99,
        quantity: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Sports & Outdoors"],
        sku: 40003,
        name: "Camping Tent",
        description: "4-person waterproof camping tent with easy setup",
        price: 149.99,
        quantity: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Books & Education
      {
        categoryId: categoryMap["Books & Education"],
        sku: 50001,
        name: "JavaScript: The Definitive Guide",
        description: "Comprehensive guide to JavaScript programming",
        price: 39.99,
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Books & Education"],
        sku: 50002,
        name: "Notebook Set",
        description: "Set of 3 ruled notebooks for note-taking",
        price: 15.99,
        quantity: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Health & Beauty
      {
        categoryId: categoryMap["Health & Beauty"],
        sku: 60001,
        name: "Skincare Set",
        description:
          "Complete skincare routine with cleanser, toner, and moisturizer",
        price: 79.99,
        quantity: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Health & Beauty"],
        sku: 60002,
        name: "Electric Toothbrush",
        description: "Rechargeable electric toothbrush with multiple modes",
        price: 69.99,
        quantity: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Toys & Games
      {
        categoryId: categoryMap["Toys & Games"],
        sku: 70001,
        name: "Board Game Collection",
        description: "Set of 5 classic board games for family fun",
        price: 49.99,
        quantity: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Toys & Games"],
        sku: 70002,
        name: "LEGO Building Set",
        description: "Creative building blocks set with 500+ pieces",
        price: 89.99,
        quantity: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Automotive
      {
        categoryId: categoryMap["Automotive"],
        sku: 80001,
        name: "Car Phone Mount",
        description: "Universal smartphone mount for car dashboard",
        price: 19.99,
        quantity: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Automotive"],
        sku: 80002,
        name: "Car Cleaning Kit",
        description: "Complete car wash and detailing kit",
        price: 44.99,
        quantity: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Food & Beverages
      {
        categoryId: categoryMap["Food & Beverages"],
        sku: 90001,
        name: "Organic Green Tea",
        description: "Premium organic green tea leaves, 100g package",
        price: 12.99,
        quantity: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Food & Beverages"],
        sku: 90002,
        name: "Artisan Chocolate Box",
        description: "Handcrafted chocolate collection with 12 pieces",
        price: 24.99,
        quantity: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Office Supplies
      {
        categoryId: categoryMap["Office Supplies"],
        sku: 100001,
        name: "Ergonomic Office Chair",
        description: "Adjustable office chair with lumbar support",
        price: 199.99,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Office Supplies"],
        sku: 100002,
        name: "Desk Organizer",
        description: "Multi-compartment desk organizer for office supplies",
        price: 29.99,
        quantity: 55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: categoryMap["Office Supplies"],
        sku: 100003,
        name: "Wireless Mouse",
        description: "Ergonomic wireless optical mouse with USB receiver",
        price: 34.99,
        quantity: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Filter out any products where categoryId is undefined (in case category doesn't exist)
    const validProducts = products.filter((product) => product.categoryId);

    await queryInterface.bulkInsert("products", validProducts, {});

    console.log(`✅ ${validProducts.length} products seeded successfully!`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
    console.log("✅ Products seed data removed successfully!");
  },
};
