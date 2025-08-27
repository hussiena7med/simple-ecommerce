import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  GetCategoriesQueryDto,
} from "../dto/category";
import {
  CategoryResourceFormatter,
  PaginatedCategoryFormatter,
} from "../resources/category";
import { ApiResponseFormatter } from "../resources/api-response";
import {
  AppException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "../utils/exceptions";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  // Create a new category
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const createCategoryDto: CreateCategoryDto = req.body;
      const category = await this.categoryService.createCategory(
        createCategoryDto
      );

      const response = ApiResponseFormatter.success(
        "Category created successfully",
        CategoryResourceFormatter.single(category)
      );

      res.status(201).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to create category",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Get all categories with optional filters and pagination
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        sortBy = "createdAt",
        sortOrder = "DESC",
        page = 1,
        limit = 10,
      } = req.query as any;

      const filters = {
        search,
        sortBy,
        sortOrder: sortOrder as "ASC" | "DESC",
      };

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
      };

      const { categories, total } = await this.categoryService.getAllCategories(
        filters,
        pagination
      );

      const response = ApiResponseFormatter.success(
        "Categories retrieved successfully",
        PaginatedCategoryFormatter.format(
          categories,
          pagination.page,
          total,
          pagination.limit
        )
      );

      res.status(200).json(response);
    } catch (error) {
      const response = ApiResponseFormatter.error(
        "Failed to retrieve categories",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(400).json(response);
    }
  }

  // Get a single category by ID
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid category ID");
        res.status(400).json(response);
        return;
      }

      const category = await this.categoryService.getCategoryById(id);

      const response = ApiResponseFormatter.success(
        "Category retrieved successfully",
        CategoryResourceFormatter.single(category)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve category",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Update a category
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid category ID");
        res.status(400).json(response);
        return;
      }

      const updateCategoryDto: UpdateCategoryDto = req.body;
      const category = await this.categoryService.updateCategory(
        id,
        updateCategoryDto
      );

      const response = ApiResponseFormatter.success(
        "Category updated successfully",
        CategoryResourceFormatter.single(category)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to update category",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Delete a category
  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid category ID");
        res.status(400).json(response);
        return;
      }

      await this.categoryService.deleteCategory(id);

      const response = ApiResponseFormatter.success(
        "Category deleted successfully"
      );
      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to delete category",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Soft delete methods
  async restoreCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid category ID");
        res.status(400).json(response);
        return;
      }

      await this.categoryService.restoreCategory(id);

      const response = ApiResponseFormatter.success(
        "Category restored successfully"
      );
      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to restore category",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  async getDeletedCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getDeletedCategories();

      const response = ApiResponseFormatter.success(
        "Deleted categories retrieved successfully",
        CategoryResourceFormatter.collection(categories)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve deleted categories",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }
}
