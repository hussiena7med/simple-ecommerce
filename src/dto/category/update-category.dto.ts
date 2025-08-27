import { IsOptional, IsString, Length } from "class-validator";

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: "Category name must be a string" })
  @Length(2, 255, {
    message: "Category name must be between 2 and 255 characters",
  })
  name?: string;
}
