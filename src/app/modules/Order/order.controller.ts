import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const createOrderController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await OrderServices.createOrder(req.user, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully",
        data: result,
    });
});

const getOrdersByUserController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await OrderServices.getOrdersByUser(req.user.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Orders retrieved successfully",
        data: result,
    });
});

const updateOrderController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { orderId } = req.params;
    const result = await OrderServices.updateOrder(req.user, orderId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order updated successfully",
        data: result,
    });
});

const getWeeklyMealSchedulesController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { weekStart } = req.query;
    if (!weekStart) {
        return res.status(400).json({
            success: false,
            message: "weekStart query parameter is required",
        });
    }
    const result = await OrderServices.getWeeklyMealSchedules(req.user.id, weekStart as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Weekly meal schedules retrieved successfully",
        data: result,
    });
});

const getMealChoicesController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await OrderServices.getMealChoices(req.user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meal choices retrieved successfully",
        data: result,
    });
});
export const OrderControllers = { createOrderController, getMealChoicesController, getOrdersByUserController, updateOrderController, getWeeklyMealSchedulesController };
