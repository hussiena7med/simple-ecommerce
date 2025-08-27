import { PaginatedResult } from "../../repositories/product.repository";
import Product from "../../models/Product";
import { ProductResourceFormatter } from "./formatters";
import { PaginatedProductResource } from "./interfaces";

export class PaginatedProductFormatter {
  /**
   * Format paginated products for API response
   */
  static format(
    paginatedProducts: PaginatedResult<Product>
  ): PaginatedProductResource {
    return {
      data: ProductResourceFormatter.collection(paginatedProducts.data),
      pagination: paginatedProducts.pagination,
    };
  }
}
