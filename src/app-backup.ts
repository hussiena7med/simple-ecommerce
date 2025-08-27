import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import sequelize from "./config/sequelize";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { helmetConfig } from "./config/helmet.config";
import { corsConfig } from "./config/cors.config";
import { compressionConfig } from "./config/compression.config";
import { setupSwagger } from "./config/swagger.config";
// Import associations to ensure they are loaded
import "./models/associations";

// Note: Environment variables are loaded in server.ts

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet(helmetConfig));

    // CORS middleware
    this.app.use(cors(corsConfig));

    // Compression middleware
    this.app.use(compression(compressionConfig));

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Trust proxy
    this.app.set("trust proxy", true);
  }

  private initializeSwagger(): void {
    // Only setup Swagger in development
    if (process.env.NODE_ENV !== 'production') {
      try {
        const swaggerJSDoc = require('swagger-jsdoc');
        const swaggerUi = require('swagger-ui-express');

        const options = {
          definition: {
            openapi: '3.0.0',
            info: {
              title: 'Simple E-commerce API',
              version: '1.0.0',
              description: 'A simple e-commerce API built with Express and TypeScript',
            },
            servers: [
              {
                url: 'http://localhost:3000',
                description: 'Development server',
              },
            ],
          },
          apis: [__dirname + '/routes/*.ts'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
        console.log('� Swagger documentation available at http://localhost:3000/api-docs');
      } catch (error) {
        console.error('❌ Failed to setup Swagger documentation:', error);
      }
    }
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use("/api/v1", routes);

    // Root endpoint
    this.app.get("/", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Welcome to Simple E-commerce API",
        version: "1.0.0",
        documentation: process.env.NODE_ENV !== 'production' ? "/api-docs" : "Documentation not available in production",
        endpoints: {
          health: "/api/v1/health",
          categories: "/api/v1/categories",
          products: "/api/v1/products",
          orders: "/api/v1/orders",
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async connectToDatabase(): Promise<void> {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection has been established successfully.");

      // Sync models (but don't alter tables as requested)
      if (process.env.NODE_ENV !== "production") {
        await sequelize.sync({ force: false, alter: false });
        console.log("✅ Database models synchronized.");
      }
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
      throw error;
    }
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api/v1`);
      console.log(`💚 Health Check: http://localhost:${port}/api/v1/health`);
    });
  }
}

export default App;
