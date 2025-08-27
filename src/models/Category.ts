import {
  DataTypes,
  Model,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
} from "sequelize";
import sequelize from "../config/sequelize";

// Define the attributes interface
interface CategoryAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define creation attributes (id is auto-generated)
interface CategoryCreationAttributes
  extends Optional<
    CategoryAttributes,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  > {}

// Define the Category model class
class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  // Association methods
  public getProducts!: HasManyGetAssociationsMixin<any>; // Will be properly typed after Product import

  // Static association definitions
  public static associations: {
    products: Association<Category, any>;
  };

  // Virtual field for associated products (populated when included)
  public products?: any[]; // Will be properly typed as Product[] after Product import
}

// Initialize the model
Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Category name cannot be empty",
        },
        len: {
          args: [2, 255],
          msg: "Category name must be between 2 and 255 characters",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: true,
    paranoid: true, // Enable soft deletes
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
      {
        fields: ["deletedAt"], // Index for soft delete queries
      },
    ],
  }
);

export default Category;
