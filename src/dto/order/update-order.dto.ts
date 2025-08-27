import { IsEnum } from "class-validator";

export class UpdateOrderDto {
  @IsEnum(["pending", "delivered", "cancelled"], {
    message: "Status must be one of: pending, delivered, cancelled",
  })
  status?: "pending" | "delivered" | "cancelled";
}
