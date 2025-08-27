import { Request, Response, NextFunction } from "express";

// Additional order validation middleware can be added here
// Currently, validation is handled by the main validation middleware
// and the product validation middleware

export function additionalOrderValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Add any additional order-specific validation logic here
  next();
}
