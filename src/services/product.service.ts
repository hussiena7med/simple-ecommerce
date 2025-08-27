import {
  ProductRepository,
  ProductFilters,
  PaginationOptions,
} from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateProductDto, UpdateProductDto } from "../dto/product";
import Product from "../models/Product";
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "../utils/exceptions";

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    // Validate input
    if (!createProductDto.name || createProductDto.name.trim().length === 0) {
      throw new BadRequestException("Product name is required");
    }

    if (!createProductDto.categoryId || createProductDto.categoryId <= 0) {
      throw new BadRequestException("Valid category ID is required");
    }

    if (!createProductDto.price || createProductDto.price < 0) {
      throw new BadRequestException("Valid price is required");
    }

    // Check if category exists
    const categoryExists = await this.categoryRepository.findById(
      createProductDto.categoryId
    );
    if (!categoryExists) {
      throw new NotFoundException("Category", createProductDto.categoryId);
    }

    // Check if product name already exists
    const nameExists = await this.productRepository.nameExists(
      createProductDto.name.trim()
    );
    if (nameExists) {
      throw new ConflictException(
        "Product",
        "name",
        createProductDto.name.trim()
      );
    }

    // Create product
    const productData = {
      name: createProductDto.name.trim(),
      categoryId: createProductDto.categoryId,
      sku: createProductDto.sku,
      description: createProductDto.description?.trim() || undefined,
      price: Number(createProductDto.price),
      quantity: createProductDto.quantity,
    };

    return await this.productRepository.create(productData);
  }

  async getAllProducts(
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ) {
    // Set default pagination values
    const paginationOptions = {
      page: pagination.page || 1,
      limit: Math.min(pagination.limit || 10, 100), // Max 100 items per page
      sortBy: pagination.sortBy || "createdAt",
      sortOrder: pagination.sortOrder || "DESC",
    };

    // Validate pagination
    if (paginationOptions.page < 1) {
      throw new BadRequestException("Page must be greater than 0");
    }

    if (paginationOptions.limit < 1) {
      throw new BadRequestException("Limit must be greater than 0");
    }

    // Process filters
    const processedFilters: ProductFilters = {};

    if (filters.search && filters.search.trim().length > 0) {
      processedFilters.search = filters.search.trim();
    }

    if (filters.categoryId && filters.categoryId > 0) {
      // Check if category exists
      const categoryExists = await this.categoryRepository.findById(
        filters.categoryId
      );
      if (!categoryExists) {
        throw new NotFoundException("Category", filters.categoryId);
      }
      processedFilters.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined && filters.minPrice >= 0) {
      processedFilters.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== undefined && filters.maxPrice >= 0) {
      processedFilters.maxPrice = filters.maxPrice;
    }

    // Validate price range
    if (
      processedFilters.minPrice !== undefined &&
      processedFilters.maxPrice !== undefined &&
      processedFilters.minPrice > processedFilters.maxPrice
    ) {
      throw new BadRequestException(
        "Min price cannot be greater than max price"
      );
    }

    return await this.productRepository.findAll(
      processedFilters,
      paginationOptions
    );
  }

  async getProductById(id: number): Promise<Product> {
    if (id <= 0) {
      throw new BadRequestException("Invalid product ID");
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product", id);
    }

    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    if (id <= 0) {
      throw new BadRequestException("Invalid product ID");
    }

    // Check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException("Product", id);
    }

    // If name is being updated, check for duplicates
    if (updateProductDto.name) {
      const nameExists = await this.productRepository.nameExists(
        updateProductDto.name.trim(),
        id
      );
      if (nameExists) {
        throw new ConflictException(
          "Product",
          "name",
          updateProductDto.name.trim()
        );
      }
    }

    // If category is being updated, check if it exists
    if (updateProductDto.categoryId) {
      if (updateProductDto.categoryId <= 0) {
        throw new BadRequestException("Invalid category ID");
      }

      const categoryExists = await this.categoryRepository.findById(
        updateProductDto.categoryId
      );
      if (!categoryExists) {
        throw new NotFoundException("Category", updateProductDto.categoryId);
      }
    }

    // If price is being updated, validate it
    if (updateProductDto.price !== undefined) {
      if (updateProductDto.price < 0) {
        throw new BadRequestException(
          "Price must be greater than or equal to 0"
        );
      }
    }

    // Prepare update data
    const updateData: Partial<{
      name: string;
      categoryId: number;
      description: string;
      price: number;
    }> = {};

    if (updateProductDto.name) {
      updateData.name = updateProductDto.name.trim();
    }

    if (updateProductDto.categoryId) {
      updateData.categoryId = updateProductDto.categoryId;
    }

    if (updateProductDto.description !== undefined) {
      updateData.description =
        updateProductDto.description?.trim() || undefined;
    }

    if (updateProductDto.price !== undefined) {
      updateData.price = Number(updateProductDto.price);
    }

    const updatedProduct = await this.productRepository.update(id, updateData);
    if (!updatedProduct) {
      throw new NotFoundException("Product", id);
    }

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    if (id <= 0) {
      throw new BadRequestException("Invalid product ID");
    }

    // Check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException("Product", id);
    }

    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException("Product", id);
    }
  }

  async getProductByName(name: string): Promise<Product | null> {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException("Product name is required");
    }

    return await this.productRepository.findByName(name.trim());
  }

  async productExists(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new BadRequestException("Invalid product ID");
    }

    const product = await this.productRepository.findById(id);
    return product !== null;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    if (categoryId <= 0) {
      throw new BadRequestException("Invalid category ID");
    }

    // Check if category exists
    const categoryExists = await this.categoryRepository.findById(categoryId);
    if (!categoryExists) {
      throw new NotFoundException("Category", categoryId);
    }

    return await this.productRepository.findByCategory(categoryId);
  }

  // Soft delete methods
  async restoreProduct(id: number): Promise<void> {
    if (id <= 0) {
      throw new BadRequestException("Invalid product ID");
    }

    // Check if product exists (including deleted ones)
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product", id);
    }

    await this.productRepository.restore(id);
  }

  async getDeletedProducts(): Promise<Product[]> {
    return await this.productRepository.findDeleted();
  }
}
