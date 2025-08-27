import "./config/env"; // Load environment variables first
import App from "./app";
import config from "./config/env";

// Get port from environment or default to 3000
const PORT = config.app.port;

// Create app instance
const app = new App();

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("❌ Uncaught Exception:", error.message);
  console.error(error.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  }
);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Start the server
async function bootstrap(): Promise<void> {
  try {
    // Connect to database
    await app.connectToDatabase();

    // Start listening
    app.listen(PORT);
  } catch (error) {
    console.error("❌ Failed to start the application:", error);
    process.exit(1);
  }
}

// Initialize the application
bootstrap();
