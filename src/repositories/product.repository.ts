import { Op, WhereOptions, OrderItem } from "sequelize";
import Product from "../models/Product";
import Category from "../models/Category";

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class ProductRepository {
  async create(productData: {
    name: string;
    categoryId: number;
    sku: number;
    description?: string;
    price: number;
    quantity: number;
  }): Promise<Product> {
    return await Product.create(productData);
  }

  async findAll(
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<Product>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = pagination;

    // Build where conditions
    const whereConditions: any = {};

    if (filters.search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    if (filters.categoryId) {
      whereConditions.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined) {
      whereConditions.price = { [Op.gte]: filters.minPrice };
    }

    if (filters.maxPrice !== undefined) {
      whereConditions.price = {
        ...(whereConditions.price as object),
        [Op.lte]: filters.maxPrice,
      };
    }

    // Build order clause
    const orderClause: OrderItem[] = [[sortBy, sortOrder]];

    // Calculate offset
    const offset = (page - 1) * limit;

    // Execute query with count
    const { count, rows } = await Product.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: orderClause,
      limit,
      offset,
      distinct: true,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: number): Promise<Product | null> {
    return await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findByName(name: string): Promise<Product | null> {
    return await Product.findOne({
      where: { name },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async nameExists(name: string, excludeId?: number): Promise<boolean> {
    const whereConditions: WhereOptions<Product> = { name };

    if (excludeId) {
      whereConditions.id = { [Op.ne]: excludeId };
    }

    const product = await Product.findOne({
      where: whereConditions,
    });

    return product !== null;
  }

  async update(
    id: number,
    updateData: Partial<{
      name: string;
      categoryId: number;
      sku: number;
      description: string;
      price: number;
      quantity: number;
    }>
  ): Promise<Product | null> {
    const [affectedCount] = await Product.update(updateData, {
      where: { id },
    });

    if (affectedCount === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await Product.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await Product.findAll({
      where: { categoryId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async deleteByCategoryId(categoryId: number): Promise<number> {
    const result = await Product.destroy({
      where: { categoryId },
    });
    return result;
  }

  // Soft delete methods
  async restore(id: number): Promise<void> {
    await Product.restore({ where: { id } });
  }

  async findDeleted(): Promise<Product[]> {
    return await Product.scope("deleted").findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["deletedAt", "DESC"]],
    });
  }
}
