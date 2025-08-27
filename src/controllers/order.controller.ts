import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../dto/order/create-order.dto";
import { UpdateOrderDto, OrderQueryDto } from "../dto/order";
import { OrderResourceFormatter } from "../resources/order/order-formatter";
import { PaginatedOrderFormatter } from "../resources/order/paginated-order-formatter";
import { ApiResponseFormatter } from "../resources/api-response";
import {
  AppException,
  NotFoundException,
  BadRequestException,
} from "../utils/exceptions";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // Create a new order
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const createOrderDto: CreateOrderDto = req.body;

      const order = await this.orderService.createOrder(createOrderDto);

      const response = ApiResponseFormatter.success(
        "Order created successfully",
        OrderResourceFormatter.single(order)
      );

      res.status(201).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to create order",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Get all orders with filtering and pagination
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const query: OrderQueryDto = req.query as any;

      const filters = {
        ...(query.userId && { userId: query.userId }),
        ...(query.status && { status: query.status }),
      };

      const paginationOptions = {
        page: query.page || 1,
        limit: query.limit || 10,
        sortBy: query.sortBy || "createdAt",
        sortOrder: query.sortOrder || "DESC",
      };

      const result = await this.orderService.getAllOrders(
        filters,
        paginationOptions
      );

      const response = ApiResponseFormatter.success(
        "Orders retrieved successfully",
        PaginatedOrderFormatter.format(result)
      );

      res.status(200).json(response);
    } catch (error) {
      const response = ApiResponseFormatter.error(
        "Failed to retrieve orders",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(400).json(response);
    }
  }

  // Get a single order by ID
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid order ID");
        res.status(400).json(response);
        return;
      }

      const order = await this.orderService.getOrderById(id);

      const response = ApiResponseFormatter.success(
        "Order retrieved successfully",
        OrderResourceFormatter.single(order)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve order",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Update an order
  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateOrderDto: UpdateOrderDto = req.body;

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid order ID");
        res.status(400).json(response);
        return;
      }

      const order = await this.orderService.updateOrder(id, updateOrderDto);

      const response = ApiResponseFormatter.success(
        "Order updated successfully",
        OrderResourceFormatter.single(order)
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to update order",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Delete an order
  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response = ApiResponseFormatter.error("Invalid order ID");
        res.status(400).json(response);
        return;
      }

      await this.orderService.deleteOrder(id);

      const response = ApiResponseFormatter.success(
        "Order deleted successfully"
      );
      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to delete order",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }

  // Get orders by user ID
  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        const response = ApiResponseFormatter.error("Invalid user ID");
        res.status(400).json(response);
        return;
      }

      const orders = await this.orderService.getOrdersByUserId(userId);

      const response = ApiResponseFormatter.success(
        "User orders retrieved successfully",
        orders.map((order) => OrderResourceFormatter.single(order))
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof AppException ? error.statusCode : 500;
      const response = ApiResponseFormatter.error(
        "Failed to retrieve user orders",
        error instanceof Error ? error.message : "Unknown error"
      );

      res.status(statusCode).json(response);
    }
  }
}
