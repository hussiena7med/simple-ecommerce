import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
  ForeignKey,
} from "sequelize";
import sequelize from "../config/sequelize";
import Category from "./Category";

// Define the interface for the Product model
export interface IProduct {
  id: number;
  categoryId: number;
  sku: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Extend Sequelize Model with proper typing
class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  // Model attributes
  declare id: CreationOptional<number>;
  declare categoryId: ForeignKey<Category["id"]>;
  declare sku: number;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare quantity: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  // Associations
  declare category?: NonAttribute<Category>;

  // Association helpers
  declare static associations: {
    category: Association<Product, Category>;
  };
}

// Initialize the model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    sku: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isInt: {
          msg: "SKU must be an integer",
        },
        min: {
          args: [1],
          msg: "SKU must be greater than 0",
        },
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Product name cannot be empty",
        },
        len: {
          args: [1, 255],
          msg: "Product name must be between 1 and 255 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Price must be greater than or equal to 0",
        },
        isDecimal: {
          msg: "Price must be a valid decimal number",
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: "Quantity must be an integer",
        },
        min: {
          args: [0],
          msg: "Quantity must be greater than or equal to 0",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    paranoid: true,
  }
);

export default Product;
