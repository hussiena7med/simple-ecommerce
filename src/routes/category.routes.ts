import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category";

const router = Router();
const categoryController = new CategoryController();

// POST /categories - Create a new category
router.post("/", validationMiddleware(CreateCategoryDto), (req, res) =>
  categoryController.createCategory(req, res)
);

// GET /categories - Get all categories with optional filters
router.get("/", (req, res) => categoryController.getAllCategories(req, res));

// GET /categories/:id - Get a single category by ID
router.get("/:id", (req, res) => categoryController.getCategoryById(req, res));

// PUT /categories/:id - Update a category
router.put("/:id", validationMiddleware(UpdateCategoryDto, true), (req, res) =>
  categoryController.updateCategory(req, res)
);

// DELETE /categories/:id - Delete a category (soft delete)
router.delete("/:id", (req, res) =>
  categoryController.deleteCategory(req, res)
);

// Soft delete related routes
// GET /categories/deleted - Get all soft deleted categories
router.get("/deleted/all", (req, res) =>
  categoryController.getDeletedCategories(req, res)
);

// POST /categories/:id/restore - Restore a soft deleted category
router.post("/:id/restore", (req, res) =>
  categoryController.restoreCategory(req, res)
);

export default router;
