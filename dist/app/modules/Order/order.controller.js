"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const createOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.createOrder(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully",
        data: result,
    });
}));
const getOrdersByUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.getOrdersByUser(req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Orders retrieved successfully",
        data: result,
    });
}));
const updateOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.OrderServices.updateOrder(req.user, orderId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order updated successfully",
        data: result,
    });
}));
const getWeeklyMealSchedulesController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { weekStart } = req.query;
    if (!weekStart) {
        return res.status(400).json({
            success: false,
            message: "weekStart query parameter is required",
        });
    }
    const result = yield order_service_1.OrderServices.getWeeklyMealSchedules(req.user.id, weekStart);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Weekly meal schedules retrieved successfully",
        data: result,
    });
}));
const getMealChoicesController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.getMealChoices(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Meal choices retrieved successfully",
        data: result,
    });
}));
exports.OrderControllers = { createOrderController, getMealChoicesController, getOrdersByUserController, updateOrderController, getWeeklyMealSchedulesController };
