export interface ProductResource {
  id: number;
  name: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  description: string | null;
  price: string; // Formatted as string for display
  sku: number; // Stock quantity
  quantity: number; // Additional quantity field
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProductResource {
  data: ProductResource[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
