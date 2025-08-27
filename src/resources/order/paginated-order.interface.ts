import { OrderResource } from "./order.interface";

export interface PaginatedOrderResource {
  data: OrderResource[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
