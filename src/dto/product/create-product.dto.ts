import {
  IsNotEmpty,
  IsString,
  Length,
  IsPositive,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsNotEmpty({ message: "Product name is required" })
  @IsString({ message: "Product name must be a string" })
  @Length(1, 255, {
    message: "Product name must be between 1 and 255 characters",
  })
  name!: string;

  @IsNotEmpty({ message: "Category ID is required" })
  @IsNumber({}, { message: "Category ID must be a number" })
  @IsPositive({ message: "Category ID must be a positive number" })
  categoryId!: number;

  @IsNotEmpty({ message: "SKU is required" })
  @IsInt({ message: "SKU must be an integer" })
  @IsPositive({ message: "SKU must be a positive number" })
  sku!: number;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;

  @IsNotEmpty({ message: "Price is required" })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Price must be a valid number with up to 2 decimal places" }
  )
  @IsPositive({ message: "Price must be a positive number" })
  price!: number;

  @IsNotEmpty({ message: "Quantity is required" })
  @IsInt({ message: "Quantity must be an integer" })
  @Min(0, { message: "Quantity must be greater than or equal to 0" })
  quantity!: number;
}
