import { CategoryResource } from "./category.interface";

export interface PaginatedCategoryResource {
  data: CategoryResource[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
