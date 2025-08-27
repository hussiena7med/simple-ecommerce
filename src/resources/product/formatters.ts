import Product from "../../models/Product";
import { ProductResource, PaginatedProductResource } from "./interfaces";
import { PaginatedResult } from "../../repositories/product.repository";

export class ProductResourceFormatter {
  /**
   * Format a single product for API response
   */
  static single(product: Product): ProductResource {
    return {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : undefined,
      description: product.description,
      price: Number(product.price).toFixed(2), // Format price to 2 decimal places
      sku: product.sku,
      quantity: product.quantity,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  /**
   * Format multiple products for API response
   */
  static collection(products: Product[]): ProductResource[] {
    return products.map((product) => this.single(product));
  }
}
