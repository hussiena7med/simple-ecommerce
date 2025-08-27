import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import { validateOrderProducts } from "../middleware/validate-products.middleware";
import { CreateOrderDto } from "../dto/order/create-order.dto";
import { UpdateOrderDto } from "../dto/order";

const router = Router();
const orderController = new OrderController();

// POST /orders - Create a new order
router.post(
  "/",
  validationMiddleware(CreateOrderDto),
  validateOrderProducts,
  (req, res) => orderController.createOrder(req, res)
);

// GET /orders - Get all orders with optional filters
router.get("/", (req, res) => orderController.getAllOrders(req, res));

// GET /orders/:id - Get a single order by ID
router.get("/:id", (req, res) => orderController.getOrderById(req, res));

// PUT /orders/:id - Update an order (status only)
router.put("/:id", validationMiddleware(UpdateOrderDto, true), (req, res) =>
  orderController.updateOrder(req, res)
);

// DELETE /orders/:id - Delete an order
router.delete("/:id", (req, res) => orderController.deleteOrder(req, res));

// GET /orders/user/:userId - Get orders by user ID
router.get("/user/:userId", (req, res) =>
  orderController.getOrdersByUserId(req, res)
);

export default router;
