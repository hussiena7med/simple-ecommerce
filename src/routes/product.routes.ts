import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
  CreateProductDto,
  UpdateProductDto,
  GetProductsQueryDto,
} from "../dto/product";

const router = Router();
const productController = new ProductController();

// Create a new product
router.post(
  "/",
  validationMiddleware(CreateProductDto),
  productController.createProduct.bind(productController)
);

// Get all products with optional filters and pagination
router.get("/", productController.getAllProducts.bind(productController));

// Get products by category
router.get(
  "/category/:categoryId",
  productController.getProductsByCategory.bind(productController)
);

// Get a single product by ID
router.get("/:id", productController.getProductById.bind(productController));

// Update a product
router.put(
  "/:id",
  validationMiddleware(UpdateProductDto),
  productController.updateProduct.bind(productController)
);

// Delete a product (soft delete)
router.delete("/:id", productController.deleteProduct.bind(productController));

// Soft delete related routes
// GET /products/deleted - Get all soft deleted products
router.get(
  "/deleted/all",
  productController.getDeletedProducts.bind(productController)
);

// POST /products/:id/restore - Restore a soft deleted product
router.post(
  "/:id/restore",
  productController.restoreProduct.bind(productController)
);

export default router;
