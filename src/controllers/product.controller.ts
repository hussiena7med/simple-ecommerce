import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import {
  CreateProductDto,
  UpdateProductDto,
  GetProductsQueryDto,
} from "../dto/product";
import {
  ProductResourceFormatter,
  PaginatedProductFormatter,
} from "../resources/product";
import { ApiResponseFormatter } from "../resources/api-response";
import {
  AppException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "../utils/exceptions";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Create a new product
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const createProductDto: CreateProductDto = req.body;
      const product = await this.productService.createProduct(createProductDto);

      const response = ApiResponseFormatter.success(
        "Product created successfully",
        ProductResourceFormatter.single(product)
      );

      res.status(201).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to create product",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Get all products with optional filters and pagination
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        categoryId,
        minPrice,
        maxPrice,
        sortBy = "createdAt",
        sortOrder = "DESC",
        page = 1,
        limit = 10,
      } = req.query;

      // Parse query parameters
      const filters = {
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      };

      const pagination = {
        page: typeof page === "string" ? parseInt(page) : (page as number),
        limit: typeof limit === "string" ? parseInt(limit) : (limit as number),
        sortBy: sortBy as string,
        sortOrder: sortOrder as "ASC" | "DESC",
      };

      const result = await this.productService.getAllProducts(
        filters,
        pagination
      );

      const response = ApiResponseFormatter.success(
        "Products retrieved successfully",
        PaginatedProductFormatter.format(result)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve products",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Get a single product by ID
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid product ID");
        res.status(400).json(response);
        return;
      }

      const product = await this.productService.getProductById(id);

      const response = ApiResponseFormatter.success(
        "Product retrieved successfully",
        ProductResourceFormatter.single(product)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve product",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Update a product
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid product ID");
        res.status(400).json(response);
        return;
      }

      const updateProductDto: UpdateProductDto = req.body;
      const product = await this.productService.updateProduct(
        id,
        updateProductDto
      );

      const response = ApiResponseFormatter.success(
        "Product updated successfully",
        ProductResourceFormatter.single(product)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to update product",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Delete a product
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid product ID");
        res.status(400).json(response);
        return;
      }

      await this.productService.deleteProduct(id);

      const response = ApiResponseFormatter.success(
        "Product deleted successfully"
      );
      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to delete product",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Get products by category
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);

      if (isNaN(categoryId)) {
        const response = ApiResponseFormatter.error("Invalid category ID");
        res.status(400).json(response);
        return;
      }

      const products = await this.productService.getProductsByCategory(
        categoryId
      );

      const response = ApiResponseFormatter.success(
        "Products retrieved successfully",
        ProductResourceFormatter.collection(products)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve products by category",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Soft delete methods
  async restoreProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid product ID");
        res.status(400).json(response);
        return;
      }

      await this.productService.restoreProduct(id);

      const response = ApiResponseFormatter.success(
        "Product restored successfully"
      );
      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to restore product",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  async getDeletedProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getDeletedProducts();

      const response = ApiResponseFormatter.success(
        "Deleted products retrieved successfully",
        ProductResourceFormatter.collection(products)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve deleted products",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }
}
