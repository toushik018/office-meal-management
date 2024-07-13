"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
router.get("/orders", (0, auth_1.default)("USER"), order_controller_1.OrderControllers.getOrdersByUserController);
router.get("/choices", (0, auth_1.default)("ADMIN"), order_controller_1.OrderControllers.getMealChoicesController);
router.get("/order/weekly-schedules", (0, auth_1.default)("USER"), order_controller_1.OrderControllers.getWeeklyMealSchedulesController);
router.patch("/order/:orderId", (0, auth_1.default)("USER"), order_controller_1.OrderControllers.updateOrderController);
router.post("/order/create-order", (0, auth_1.default)("USER"), (0, validateRequest_1.default)(order_validation_1.createOrderSchema), order_controller_1.OrderControllers.createOrderController);
exports.orderRoutes = router;
