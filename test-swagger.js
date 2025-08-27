const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

console.log("Current directory:", __dirname);
console.log("Testing swagger paths...");

// Test different path configurations
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
    },
  },
  apis: [path.join(__dirname, "src/routes/*.ts")],
};

try {
  const specs = swaggerJSDoc(options);
  console.log("Generated specs:", JSON.stringify(specs, null, 2));
} catch (error) {
  console.error("Error generating specs:", error.message);
}
