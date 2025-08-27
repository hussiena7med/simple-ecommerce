import OrderDetail from "../models/OrderDetail";

export interface OrderDetailFilters {
  orderId?: number;
  productId?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class OrderDetailRepository {
  async create(data: {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
  }): Promise<OrderDetail> {
    return await OrderDetail.create(data);
  }

  async findById(id: number): Promise<OrderDetail | null> {
    return await OrderDetail.findByPk(id, {
      include: [
        {
          association: "product",
          attributes: ["id", "name", "sku", "price"],
        },
      ],
    });
  }

  async findAll(
    filters: OrderDetailFilters = {},
    options: PaginationOptions = {}
  ): Promise<{ orderDetails: OrderDetail[]; total: number }> {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (filters.orderId) {
      whereClause.orderId = filters.orderId;
    }

    if (filters.productId) {
      whereClause.productId = filters.productId;
    }

    const { count, rows } = await OrderDetail.findAndCountAll({
      where: whereClause,
      include: [
        {
          association: "product",
          attributes: ["id", "name", "sku", "price"],
        },
      ],
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      orderDetails: rows,
      total: count,
    };
  }

  async update(
    id: number,
    data: { quantity?: number; price?: number }
  ): Promise<OrderDetail | null> {
    const orderDetail = await this.findById(id);
    if (!orderDetail) {
      return null;
    }

    await orderDetail.update(data);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const orderDetail = await OrderDetail.findByPk(id);
    if (!orderDetail) {
      return false;
    }

    await orderDetail.destroy();
    return true;
  }

  async findByOrderId(orderId: number): Promise<OrderDetail[]> {
    return await OrderDetail.findAll({
      where: { orderId },
      include: [
        {
          association: "product",
          attributes: ["id", "name", "sku", "price", "quantity"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }
}
