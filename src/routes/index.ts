import { Router } from "express";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";

const router = Router();

// API routes
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default router;
