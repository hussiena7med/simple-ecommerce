import Category from "../../models/Category";
import { CategoryResource } from "./category.interface";

export class CategoryResourceFormatter {
  static single(category: Category): CategoryResource {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  static collection(categories: Category[]): CategoryResource[] {
    return categories.map((category) => this.single(category));
  }
}
