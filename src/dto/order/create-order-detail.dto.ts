import { IsNotEmpty, IsNumber, IsPositive, IsInt, Min } from "class-validator";

export class CreateOrderDetailDto {
  @IsNotEmpty({ message: "Product ID is required" })
  @IsNumber({}, { message: "Product ID must be a number" })
  @IsPositive({ message: "Product ID must be a positive number" })
  productId!: number;

  @IsNotEmpty({ message: "Quantity is required" })
  @IsInt({ message: "Quantity must be an integer" })
  @Min(1, { message: "Quantity must be at least 1" })
  quantity!: number;

  @IsNotEmpty({ message: "Price is required" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Price must be a valid number with up to 2 decimal places" }
  )
  @IsPositive({ message: "Price must be a positive number" })
  price!: number;
}
