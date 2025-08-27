import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Simple E-commerce API",
      version: "1.0.0",
      description:
        "A comprehensive e-commerce API built with TypeScript, Express, and MySQL",
      contact: {
        name: "API Support",
        email: "support@simple-ecommerce.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Unique identifier" },
            name: { type: "string", description: "Category name" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "createdAt", "updatedAt"],
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Unique identifier" },
            categoryId: { type: "integer", description: "Category ID" },
            sku: {
              type: "integer",
              description: "Stock Keeping Unit",
              minimum: 1,
            },
            name: { type: "string", description: "Product name" },
            description: { type: "string", nullable: true },
            price: { type: "number", format: "decimal", minimum: 0 },
            quantity: { type: "integer", minimum: 0 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "categoryId", "sku", "name", "price", "quantity"],
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Unique identifier" },
            userId: {
              type: "integer",
              description: "User ID who placed the order",
            },
            status: {
              type: "string",
              enum: ["pending", "delivered", "cancelled"],
              description: "Order status",
            },
            total: {
              type: "number",
              format: "decimal",
              minimum: 0,
              description: "Total order amount",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            orderDetails: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderDetail" },
              description: "Order items",
            },
          },
          required: [
            "id",
            "userId",
            "status",
            "total",
            "createdAt",
            "updatedAt",
          ],
        },
        OrderDetail: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Unique identifier" },
            orderId: { type: "integer", description: "Order ID" },
            productId: { type: "integer", description: "Product ID" },
            quantity: {
              type: "integer",
              minimum: 1,
              description: "Quantity ordered",
            },
            unitPrice: {
              type: "number",
              format: "decimal",
              minimum: 0,
              description: "Price per unit at time of order",
            },
            subtotal: {
              type: "number",
              format: "decimal",
              minimum: 0,
              description: "Total price for this item (quantity * unitPrice)",
            },
            product: {
              $ref: "#/components/schemas/Product",
              description: "Product details",
            },
          },
          required: [
            "id",
            "orderId",
            "productId",
            "quantity",
            "unitPrice",
            "subtotal",
          ],
        },
        CreateOrderRequest: {
          type: "object",
          properties: {
            userId: {
              type: "integer",
              minimum: 1,
              description: "ID of the user placing the order",
            },
            products: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                properties: {
                  productId: {
                    type: "integer",
                    minimum: 1,
                    description: "Product ID",
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1,
                    description: "Quantity to order",
                  },
                },
                required: ["productId", "quantity"],
              },
              description: "List of products to order",
            },
          },
          required: ["userId", "products"],
        },
        UpdateOrderRequest: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["pending", "delivered", "cancelled"],
              description: "New order status",
            },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              minimum: 1,
              description: "Current page number",
            },
            limit: {
              type: "integer",
              minimum: 1,
              description: "Items per page",
            },
            total: {
              type: "integer",
              minimum: 0,
              description: "Total number of items",
            },
            totalPages: {
              type: "integer",
              minimum: 1,
              description: "Total number of pages",
            },
          },
          required: ["page", "limit", "total", "totalPages"],
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { description: "Response data" },
          },
          required: ["success", "message"],
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            error: { type: "string" },
          },
          required: ["success", "message"],
        },
      },
    },
    tags: [
      { name: "Health", description: "API health check" },
      { name: "Categories", description: "Category management" },
      { name: "Products", description: "Product management" },
      { name: "Orders", description: "Order management" },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customSiteTitle: "Simple E-commerce API Documentation",
    })
  );

  // JSON endpoint for the spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};
