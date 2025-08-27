import { IsOptional, IsString, IsIn } from "class-validator";
import { Transform } from "class-transformer";

export class GetCategoriesQueryDto {
  @IsOptional()
  @IsString({ message: "Search term must be a string" })
  search?: string;

  @IsOptional()
  @IsString({ message: "Sort field must be a string" })
  @IsIn(["id", "name", "createdAt", "updatedAt"], {
    message: "Sort field must be one of: id, name, createdAt, updatedAt",
  })
  sortBy?: string = "createdAt";

  @IsOptional()
  @IsString({ message: "Sort order must be a string" })
  @IsIn(["ASC", "DESC"], { message: "Sort order must be ASC or DESC" })
  sortOrder?: "ASC" | "DESC" = "DESC";

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
