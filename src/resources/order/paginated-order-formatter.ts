import { PaginatedResult } from "../../repositories/order.repository";
import Order from "../../models/Order";
import { PaginatedOrderResource } from "./paginated-order.interface";
import { OrderResourceFormatter } from "./order-formatter";

export class PaginatedOrderFormatter {
  static format(result: PaginatedResult<Order>): PaginatedOrderResource {
    return {
      data: OrderResourceFormatter.collection(result.data),
      pagination: {
        currentPage: result.pagination.currentPage,
        totalPages: result.pagination.totalPages,
        totalItems: result.pagination.totalItems,
        itemsPerPage: result.pagination.itemsPerPage,
      },
    };
  }
}
