import { Op, WhereOptions, OrderItem, QueryTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Order from "../models/Order";
import OrderDetail from "../models/OrderDetail";
import Product from "../models/Product";
import Category from "../models/Category";

export interface OrderFilters {
  search?: string;
  userId?: number;
  status?: "pending" | "delivered" | "cancelled";
  minTotal?: number;
  maxTotal?: number;
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

export class OrderRepository {
  async create(orderData: {
    userId: number;
    total: number;
    status: "pending" | "delivered" | "cancelled";
  }): Promise<Order> {
    return await Order.create(orderData);
  }

  async findById(id: number): Promise<Order | null> {
    return await sequelize
      .query(
        `
      SELECT 
        o.*,
        od.id as "orderDetails.id",
        od.orderId as "orderDetails.orderId", 
        od.productId as "orderDetails.productId",
        od.price as "orderDetails.price",
        od.createdAt as "orderDetails.createdAt",
        od.updatedAt as "orderDetails.updatedAt",
        p.id as "orderDetails.product.id",
        p.name as "orderDetails.product.name",
        p.deletedAt as "orderDetails.product.deletedAt",
        c.id as "orderDetails.product.category.id",
        c.name as "orderDetails.product.category.name"
      FROM orders o
      LEFT JOIN orderDetails od ON o.id = od.orderId
      LEFT JOIN products p ON od.productId = p.id
      LEFT JOIN categories c ON p.categoryId = c.id AND c.deletedAt IS NULL
      WHERE o.id = :orderId
    `,
        {
          replacements: { orderId: id },
          type: QueryTypes.SELECT,
          nest: true,
        }
      )
      .then((results: any[]) => {
        if (!results.length) return null;

        // Group the results to reconstruct the nested structure
        const orderData = results[0];
        const orderDetails: any[] = [];

        results.forEach((row: any) => {
          if (row.orderDetails.id) {
            const existingDetail = orderDetails.find(
              (od) => od.id === row.orderDetails.id
            );
            if (!existingDetail) {
              orderDetails.push({
                id: row.orderDetails.id,
                orderId: row.orderDetails.orderId,
                productId: row.orderDetails.productId,
                price: row.orderDetails.price,
                createdAt: row.orderDetails.createdAt,
                updatedAt: row.orderDetails.updatedAt,
                product: row.orderDetails.product.id
                  ? {
                      id: row.orderDetails.product.id,
                      name: row.orderDetails.product.name,
                      deletedAt: row.orderDetails.product.deletedAt,
                      category: row.orderDetails.product.category.id
                        ? {
                            id: row.orderDetails.product.category.id,
                            name: row.orderDetails.product.category.name,
                          }
                        : null,
                    }
                  : null,
              });
            }
          }
        });

        return {
          id: orderData.id,
          userId: orderData.userId,
          total: orderData.total,
          status: orderData.status,
          createdAt: orderData.createdAt,
          updatedAt: orderData.updatedAt,
          orderDetails: orderDetails,
        } as Order;
      });
  }

  async findAll(
    filters: OrderFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<Order>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = pagination;

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions: WhereOptions = {};

    if (filters.userId) {
      whereConditions.userId = filters.userId;
    }

    if (filters.status) {
      whereConditions.status = filters.status;
    }

    if (filters.minTotal || filters.maxTotal) {
      whereConditions.total = {};
      if (filters.minTotal) {
        whereConditions.total[Op.gte] = filters.minTotal;
      }
      if (filters.maxTotal) {
        whereConditions.total[Op.lte] = filters.maxTotal;
      }
    }

    // Build order
    const order: OrderItem[] = [[sortBy as string, sortOrder]];

    const { count, rows } = await Order.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: OrderDetail,
          as: "orderDetails",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "deletedAt"],
              paranoid: false, // Include soft-deleted products
              required: false, // Left join to include even if product is soft-deleted
            },
          ],
        },
      ],
      limit,
      offset,
      order,
      distinct: true,
    });

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

  async update(
    id: number,
    updateData: Partial<{ status: "pending" | "delivered" | "cancelled" }>
  ): Promise<Order | null> {
    const [updatedRowsCount] = await Order.update(updateData, {
      where: { id },
      returning: false,
    });

    if (updatedRowsCount === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedRowsCount = await Order.destroy({
      where: { id },
    });

    return deletedRowsCount > 0;
  }

  async exists(id: number): Promise<boolean> {
    const order = await Order.findByPk(id);
    return order !== null;
  }

  async count(filters: OrderFilters = {}): Promise<number> {
    const whereConditions: WhereOptions = {};

    if (filters.userId) {
      whereConditions.userId = filters.userId;
    }

    if (filters.status) {
      whereConditions.status = filters.status;
    }

    return await Order.count({
      where: whereConditions,
    });
  }
}
