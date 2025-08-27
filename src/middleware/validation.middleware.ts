import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export function validationMiddleware<T extends object>(
  type: new () => T,
  skipMissingProperties = false
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(type, req.body);
      const errors = await validate(dto, { skipMissingProperties });

      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      req.body = dto;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
