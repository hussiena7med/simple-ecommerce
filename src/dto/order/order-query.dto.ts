import { IsInt, Min, IsEnum, IsOptional, IsString } from "class-validator";

export class OrderQueryDto {
  @IsOptional()
  @IsInt({ message: "User ID must be an integer" })
  @Min(1, { message: "User ID must be greater than 0" })
  userId?: number;

  @IsOptional()
  @IsEnum(["pending", "delivered", "cancelled"], {
    message: "Status must be one of: pending, delivered, cancelled",
  })
  status?: "pending" | "delivered" | "cancelled";

  @IsOptional()
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be greater than 0" })
  page?: number;

  @IsOptional()
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be greater than 0" })
  limit?: number;

  @IsOptional()
  @IsString({ message: "Sort by must be a string" })
  @IsEnum(["createdAt", "updatedAt", "total", "status"], {
    message: "Sort by must be one of: createdAt, updatedAt, total, status",
  })
  sortBy?: string;

  @IsOptional()
  @IsString({ message: "Sort order must be a string" })
  @IsEnum(["ASC", "DESC"], {
    message: "Sort order must be either ASC or DESC",
  })
  sortOrder?: "ASC" | "DESC";
}
