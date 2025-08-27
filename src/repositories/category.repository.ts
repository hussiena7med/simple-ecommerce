import { Op, WhereOptions } from "sequelize";
import Category from "../models/Category";

export interface CategoryFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class CategoryRepository {
  async create(data: { name: string }): Promise<Category> {
    return await Category.create(data);
  }

  async findById(id: number): Promise<Category | null> {
    return await Category.findByPk(id);
  }

  async findByName(name: string): Promise<Category | null> {
    return await Category.findOne({ where: { name } });
  }

  async findAll(
    filters: CategoryFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ categories: Category[]; total: number }> {
    const { search, sortBy = "createdAt", sortOrder = "DESC" } = filters;
    const { page = 1, limit = 10 } = pagination;

    // Build where conditions
    const whereConditions: WhereOptions = {};

    if (search) {
      whereConditions.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Execute query with count
    const { rows: categories, count: total } = await Category.findAndCountAll({
      where: whereConditions,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return { categories, total };
  }

  async update(
    id: number,
    data: Partial<{ name: string }>
  ): Promise<Category | null> {
    const category = await Category.findByPk(id);
    if (!category) {
      return null;
    }

    await category.update(data);
    return category;
  }

  async delete(id: number): Promise<boolean> {
    const result = await Category.destroy({
      where: { id },
    });
    return result > 0;
  }

  async exists(id: number): Promise<boolean> {
    const category = await Category.findByPk(id);
    return !!category;
  }

  async nameExists(name: string, excludeId?: number): Promise<boolean> {
    const whereConditions: WhereOptions = { name };

    if (excludeId) {
      whereConditions.id = {
        [Op.ne]: excludeId,
      };
    }

    const category = await Category.findOne({ where: whereConditions });
    return !!category;
  }

  async count(filters: CategoryFilters = {}): Promise<number> {
    const { search } = filters;

    const whereConditions: WhereOptions = {};

    if (search) {
      whereConditions.name = {
        [Op.like]: `%${search}%`,
      };
    }

    return await Category.count({ where: whereConditions });
  }

  // Soft delete methods
  async restore(id: number): Promise<void> {
    await Category.restore({ where: { id } });
  }

  async findDeleted(): Promise<Category[]> {
    return await Category.findAll({
      paranoid: false, // Include soft deleted records
      where: {
        deletedAt: { [Op.not]: null },
      },
    });
  }
}
