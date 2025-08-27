import {
  CategoryRepository,
  CategoryFilters,
  PaginationOptions,
} from "../repositories/category.repository";
import { ProductRepository } from "../repositories/product.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category";
import Category from "../models/Category";
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "../utils/exceptions";

export class CategoryService {
  private categoryRepository: CategoryRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
    this.productRepository = new ProductRepository();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    // Check if category name already exists
    const existingCategory = await this.categoryRepository.findByName(
      createCategoryDto.name
    );
    if (existingCategory) {
      throw new ConflictException("Category", "name", createCategoryDto.name);
    }

    // Create the category
    return await this.categoryRepository.create({
      name: createCategoryDto.name.trim(),
    });
  }

  async getCategoryById(id: number): Promise<Category> {
    if (id <= 0) {
      throw new BadRequestException("Invalid category ID");
    }

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category", id);
    }

    return category;
  }

  async getAllCategories(
    filters: CategoryFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ categories: Category[]; total: number }> {
    // Set default pagination values
    const { page = 1, limit = 10 } = pagination;

    // Validate pagination parameters
    if (page < 1) {
      throw new BadRequestException("Page number must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException("Limit must be between 1 and 100");
    }

    // Validate sort order
    if (filters.sortOrder && !["ASC", "DESC"].includes(filters.sortOrder)) {
      throw new BadRequestException("Sort order must be ASC or DESC");
    }

    return await this.categoryRepository.findAll(filters, { page, limit });
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    if (id <= 0) {
      throw new BadRequestException("Invalid category ID");
    }

    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException("Category", id);
    }

    // If name is being updated, check for duplicates
    if (updateCategoryDto.name) {
      const nameExists = await this.categoryRepository.nameExists(
        updateCategoryDto.name,
        id
      );
      if (nameExists) {
        throw new ConflictException("Category", "name", updateCategoryDto.name);
      }
    }

    // Prepare update data
    const updateData: Partial<{ name: string }> = {};
    if (updateCategoryDto.name) {
      updateData.name = updateCategoryDto.name.trim();
    }

    const updatedCategory = await this.categoryRepository.update(
      id,
      updateData
    );
    if (!updatedCategory) {
      throw new NotFoundException("Category", id);
    }

    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    if (id <= 0) {
      throw new BadRequestException("Invalid category ID");
    }

    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException("Category", id);
    }

    // First, soft delete all products in this category
    await this.productRepository.deleteByCategoryId(id);

    // Then soft delete the category
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException("Category", id);
    }
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException("Category name is required");
    }

    return await this.categoryRepository.findByName(name.trim());
  }

  async categoryExists(id: number): Promise<boolean> {
    if (id <= 0) {
      return false;
    }

    return await this.categoryRepository.exists(id);
  }

  async getCategoriesCount(filters: CategoryFilters = {}): Promise<number> {
    return await this.categoryRepository.count(filters);
  }

  // Soft delete methods
  async restoreCategory(id: number): Promise<void> {
    if (id <= 0) {
      throw new BadRequestException("Invalid category ID");
    }

    await this.categoryRepository.restore(id);
  }

  async getDeletedCategories(): Promise<Category[]> {
    return await this.categoryRepository.findDeleted();
  }
}
