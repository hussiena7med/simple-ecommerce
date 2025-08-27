import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty({ message: "Category name is required" })
  @IsString({ message: "Category name must be a string" })
  @Length(2, 255, {
    message: "Category name must be between 2 and 255 characters",
  })
  name!: string;
}
