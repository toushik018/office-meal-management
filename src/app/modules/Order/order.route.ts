import { Router } from "express";

import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { OrderControllers } from "./order.controller";
import { createOrderSchema } from "./order.validation";

const router = Router();

router.get("/orders", auth("USER"), OrderControllers.getOrdersByUserController);
router.get("/choices", auth("ADMIN"), OrderControllers.getMealChoicesController);
router.get("/order/weekly-schedules", auth("USER"), OrderControllers.getWeeklyMealSchedulesController);
router.patch("/order/:orderId", auth("USER"), OrderControllers.updateOrderController);

router.post("/order/create-order", auth("USER"), validateRequest(createOrderSchema), OrderControllers.createOrderController);

export const orderRoutes = router;
