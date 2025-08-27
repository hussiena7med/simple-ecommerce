export interface OrderDetailResource {
  id: number;
  productId: number;
  productName: string;
  price: string;
}

export interface OrderResource {
  id: number;
  userId: number;
  total: string;
  status: string;
  orderDetails: OrderDetailResource[];
  createdAt: string;
  updatedAt: string;
}
