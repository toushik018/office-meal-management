import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import { UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUser(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User Created successfully",
        data: result,
    });
});


const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminData = { ...req.body, role: "ADMIN" };
    const result = await UserServices.createUser(adminData);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin registered successfully",
        data: result,
    });
});

const updateUserController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.params.id;
    const payload = req.body;
    const result = await UserServices.updateUser(req.user, userId, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await UserServices.getAllUsers(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
})





const banUserController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.params.id;

    const result = await UserServices.banUser(req.user, userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User banned successfully",
        data: result,
    });
});

const getUserController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.params.id;

    const result = await UserServices.getUserById(req.user, userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});


// const deleteUser = catchAsync(async (req: Request & { user?: any }, res: Response) => {
//     const { userId } = req.params;
//     const result = await UserServices.deleteUser(userId);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "User deleted successfully",
//         data: result,
//     });
// });



export const userControllers = {
    createUser,
    createAdmin,
    getUserController,
    banUserController,
    updateUserController,
    getAllUsers

}