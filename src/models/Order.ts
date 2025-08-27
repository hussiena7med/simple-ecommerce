import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

// Forward declaration for associations
interface OrderDetailType {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the attributes interface
export interface OrderAttributes {
  id: number;
  userId: number;
  total: number;
  status: "pending" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Define the creation attributes (attributes that are optional during creation)
interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the Order model class
class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public userId!: number;
  public total!: number;
  public status!: "pending" | "delivered" | "cancelled";
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations will be added here
  public orderDetails?: OrderDetailType[];
}

// Initialize the model
Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;
