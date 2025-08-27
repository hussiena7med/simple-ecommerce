import sequelize from "./src/config/sequelize";

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    await sequelize.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

testConnection();
