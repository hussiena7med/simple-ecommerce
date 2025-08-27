import Order from "../../models/Order";
import { OrderResource, OrderDetailResource } from "./order.interface";

export class OrderResourceFormatter {
  static single(order: Order): OrderResource {
    const orderDetails: OrderDetailResource[] = order.orderDetails
      ? order.orderDetails.map((detail) => {
          const product = (detail as any).product;
          const productName = product?.name || "Unknown Product";

          return {
            id: detail.id,
            productId: detail.productId,
            productName: productName,
            price: Number(detail.price).toFixed(2),
          };
        })
      : [];

    return {
      id: order.id,
      userId: order.userId,
      total: Number(order.total).toFixed(2),
      status: order.status,
      orderDetails: orderDetails,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  static collection(orders: Order[]): OrderResource[] {
    return orders.map((order) => this.single(order));
  }
}
