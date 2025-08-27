import { IsUUID, IsNumberString } from "class-validator";

export class CategoryParamsDto {
  @IsNumberString({}, { message: "Category ID must be a valid number" })
  id!: string;
}
