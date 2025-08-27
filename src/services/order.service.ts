import {
  OrderRepository,
  OrderFilters,
  PaginationOptions,
} from "../repositories/order.repository";
import { OrderDetailRepository } from "../repositories/order-detail.repository";
import { ProductRepository } from "../repositories/product.repository";
import { CreateOrderDto } from "../dto/order/create-order.dto";
import { UpdateOrderDto } from "../dto/order";
import Order from "../models/Order";
import { NotFoundException, BadRequestException } from "../utils/exceptions";

export class OrderService {
  private orderRepository: OrderRepository;
  private orderDetailRepository: OrderDetailRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderDetailRepository = new OrderDetailRepository();
    this.productRepository = new ProductRepository();
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate all products exist and have enough stock, calculate total
    let total = 0;
    const productValidations: Array<{ product: any; quantity: number }> = [];

    for (const productOrder of createOrderDto.products) {
      const product = await this.productRepository.findById(
        productOrder.productId
      );
      if (!product) {
        throw new NotFoundException("Product", productOrder.productId);
      }

      // Check if there's enough stock
      if (product.sku < productOrder.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.sku}, Requested: ${productOrder.quantity}`
        );
      }

      // Calculate total price
      total += Number(product.price) * productOrder.quantity;
      productValidations.push({ product, quantity: productOrder.quantity });
    }

    // Create the order with calculated total
    const order = await this.orderRepository.create({
      userId: createOrderDto.userId,
      total: Number(total.toFixed(2)),
      status: "pending",
    });

    // Create order details and reduce product quantities
    for (const validation of productValidations) {
      await this.orderDetailRepository.create({
        orderId: order.id,
        productId: validation.product.id,
        quantity: validation.quantity,
        price: Number(validation.product.price),
      });

      // Reduce product quantity
      await this.productRepository.update(validation.product.id, {
        name: validation.product.name,
        categoryId: validation.product.categoryId,
        description: validation.product.description || undefined,
        price: validation.product.price,
        sku: validation.product.sku - validation.quantity,
        quantity: validation.product.quantity,
      });
    }

    // Return order with details
    return (await this.orderRepository.findById(order.id)) as Order;
  }

  async getOrderById(id: number): Promise<Order> {
    if (id <= 0) {
      throw new BadRequestException("Invalid order ID");
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException("Order", id);
    }

    return order;
  }

  async getAllOrders(
    filters: OrderFilters = {},
    {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    }: PaginationOptions = {}
  ) {
    if (page <= 0) {
      throw new BadRequestException("Page must be greater than 0");
    }

    if (limit <= 0) {
      throw new BadRequestException("Limit must be greater than 0");
    }

    return await this.orderRepository.findAll(filters, {
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    if (id <= 0) {
      throw new BadRequestException("Invalid order ID");
    }

    // Check if order exists
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException("Order", id);
    }

    // Prepare update data
    const updateData: Partial<{
      status: "pending" | "delivered" | "cancelled";
    }> = {};
    if (updateOrderDto.status) {
      updateData.status = updateOrderDto.status;
    }

    const updatedOrder = await this.orderRepository.update(id, updateData);
    if (!updatedOrder) {
      throw new NotFoundException("Order", id);
    }

    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<void> {
    if (id <= 0) {
      throw new BadRequestException("Invalid order ID");
    }

    // Check if order exists
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException("Order", id);
    }

    const deleted = await this.orderRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException("Order", id);
    }
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    if (userId <= 0) {
      throw new BadRequestException("Invalid user ID");
    }

    const result = await this.orderRepository.findAll({ userId });
    return result.data;
  }

  async getOrdersCount(filters: OrderFilters = {}): Promise<number> {
    return await this.orderRepository.count(filters);
  }

  async orderExists(id: number): Promise<boolean> {
    if (id <= 0) {
      return false;
    }

    return await this.orderRepository.exists(id);
  }
}
