import { Request, Response, NextFunction } from "express";

export function validateOrderProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { products } = req.body;
  const errors: any[] = [];

  // Validate products array structure
  if (products && Array.isArray(products)) {
    products.forEach((product: any, index: number) => {
      // Validate productId
      if (!product.hasOwnProperty("productId")) {
        errors.push({
          property: `products[${index}].productId`,
          constraints: {
            isRequired: "Product ID is required",
          },
        });
      } else if (
        typeof product.productId !== "number" ||
        !Number.isInteger(product.productId) ||
        product.productId <= 0
      ) {
        errors.push({
          property: `products[${index}].productId`,
          value: product.productId,
          constraints: {
            isPositiveInteger: "Product ID must be a positive integer",
          },
        });
      }

      // Validate quantity
      if (!product.hasOwnProperty("quantity")) {
        errors.push({
          property: `products[${index}].quantity`,
          constraints: {
            isRequired: "Quantity is required",
          },
        });
      } else if (
        typeof product.quantity !== "number" ||
        !Number.isInteger(product.quantity) ||
        product.quantity <= 0
      ) {
        errors.push({
          property: `products[${index}].quantity`,
          value: product.quantity,
          constraints: {
            isPositiveInteger: "Quantity must be a positive integer",
          },
        });
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Product validation failed",
      errors: errors,
    });
  }

  next();
}
