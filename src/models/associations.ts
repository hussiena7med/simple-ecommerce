import Category from "./Category";
import Product from "./Product";
import Order from "./Order";
import OrderDetail from "./OrderDetail";

// Category - Product associations
Category.hasMany(Product, {
  foreignKey: {
    name: "categoryId",
    field: "categoryId",
  },
  as: "products",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Product.belongsTo(Category, {
  foreignKey: {
    name: "categoryId",
    field: "categoryId",
  },
  as: "category",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// Order - OrderDetail associations
Order.hasMany(OrderDetail, {
  foreignKey: "orderId",
  as: "orderDetails",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderDetail.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Product - OrderDetail associations
Product.hasMany(OrderDetail, {
  foreignKey: "productId",
  as: "orderDetails",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

OrderDetail.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

export { Category, Product, Order, OrderDetail };
