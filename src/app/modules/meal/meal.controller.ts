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

export const MealControllers = { createMealController, updateMealController, deleteMealController, getMealsController };
