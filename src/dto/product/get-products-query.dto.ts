import { IsOptional, IsString, IsIn, IsNumberString } from "class-validator";
import { Transform } from "class-transformer";

export class GetProductsQueryDto {
  @IsOptional()
  @IsString({ message: "Search term must be a string" })
  search?: string;

  @IsOptional()
  @IsNumberString({}, { message: "Category ID must be a number" })
  categoryId?: string;

  @IsOptional()
  @IsNumberString({}, { message: "Min price must be a number" })
  minPrice?: string;

  @IsOptional()
  @IsNumberString({}, { message: "Max price must be a number" })
  maxPrice?: string;

  @IsOptional()
  @IsIn(["id", "name", "price", "createdAt", "updatedAt"], {
    message: "Sort by must be one of: id, name, price, createdAt, updatedAt",
  })
  sortBy?: string;

  @IsOptional()
  @IsIn(["ASC", "DESC"], {
    message: "Sort order must be either ASC or DESC",
  })
  sortOrder?: "ASC" | "DESC";

  @IsOptional()
  @IsNumberString({}, { message: "Page must be a number" })
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @IsNumberString({}, { message: "Limit must be a number" })
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
