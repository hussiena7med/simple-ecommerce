import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

// Define the attributes interface
export interface OrderDetailAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the creation attributes (attributes that are optional during creation)
interface OrderDetailCreationAttributes
  extends Optional<OrderDetailAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the OrderDetail model class
class OrderDetail
  extends Model<OrderDetailAttributes, OrderDetailCreationAttributes>
  implements OrderDetailAttributes
{
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations will be added here
}

// Initialize the model
OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: "Quantity must be an integer",
        },
        min: {
          args: [1],
          msg: "Quantity must be greater than 0",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    modelName: "OrderDetail",
    tableName: "orderDetails",
    timestamps: true,
  }
);

export default OrderDetail;
