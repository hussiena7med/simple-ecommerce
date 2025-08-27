import {
  IsOptional,
  IsString,
  Length,
  IsPositive,
  IsNumber,
  IsInt,
  Min,
} from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: "Product name must be a string" })
  @Length(1, 255, {
    message: "Product name must be between 1 and 255 characters",
  })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: "Category ID must be a number" })
  @IsPositive({ message: "Category ID must be a positive number" })
  categoryId?: number;

  @IsOptional()
  @IsInt({ message: "SKU must be an integer" })
  @IsPositive({ message: "SKU must be a positive number" })
  sku?: number;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Price must be a valid number with up to 2 decimal places" }
  )
  @IsPositive({ message: "Price must be a positive number" })
  price?: number;

  @IsOptional()
  @IsInt({ message: "Quantity must be an integer" })
  @Min(0, { message: "Quantity must be greater than or equal to 0" })
  quantity?: number;
}
