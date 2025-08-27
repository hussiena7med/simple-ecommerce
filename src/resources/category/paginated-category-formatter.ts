import Category from "../../models/Category";
import { PaginatedCategoryResource } from "./paginated-category.interface";
import { CategoryResourceFormatter } from "./category-formatter";

export class PaginatedCategoryFormatter {
  static format(
    categories: Category[],
    currentPage: number,
    totalItems: number,
    itemsPerPage: number
  ): PaginatedCategoryResource {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: CategoryResourceFormatter.collection(categories),
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
      },
    };
  }
}
