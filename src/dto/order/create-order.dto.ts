import {
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsArray,
  ArrayMinSize,
} from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty({ message: "User ID is required" })
  @IsInt({ message: "User ID must be an integer" })
  @IsPositive({ message: "User ID must be a positive number" })
  userId!: number;

  @IsNotEmpty({ message: "Products are required" })
  @IsArray({ message: "Products must be an array" })
  @ArrayMinSize(1, { message: "At least one product is required" })
  products!: Array<{
    productId: number;
    quantity: number;
  }>;
}
