import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MealServices } from "./meal.service";

const createMealController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await MealServices.createMeal(req.user, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Meal created successfully",
        data: result,
    });
});

const updateMealController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const mealId = req.params.id;
    const result = await MealServices.updateMeal(req.user, mealId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meal updated successfully",
        data: result,
    });
});

const deleteMealController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const mealId = req.params.id;
    await MealServices.deleteMeal(req.user, mealId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meal deleted successfully",
        data: null,
    });
});

const getMealsController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await MealServices.getMeals(req.user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meals retrieved successfully",
        data: result,
    });
});

const scheduleMealController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await MealServices.scheduleMeal(req.user, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meal scheduled successfully",
        data: result,
    });
});

const getScheduledMealsController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({
            success: false,
            message: "Date query parameter is required"
        });
    }
    const result = await MealServices.getScheduledMeals(date as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Scheduled meals retrieved successfully",
        data: result,
    });
});

const getMealChoicesForUsersController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await MealServices.getMealChoicesForUsers();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meal choices retrieved successfully",
        data: result,
    });
});

export const MealControllers = {
    createMealController,
    updateMealController,
    deleteMealController,
    getMealsController,
    scheduleMealController,
    getScheduledMealsController,
    getMealChoicesForUsersController
};
