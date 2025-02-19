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

// const updateUserController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
//     const userId = req.params.id;
//     const payload = req.body;
//     const result = await UserServices.updateUser(req.user, userId, payload);
//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "User updated successfully",
//         data: result,
//     });
// });

const updateUserController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;
    const userData = req.body;
    const result = await UserServices.updateUser(userId, userData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile updated successfully",
        data: result
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
    const { userId, status } = req.body;

    if (req.user.role !== 'ADMIN') {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update user status');
    }

    if (!Object.values(UserStatus).includes(status)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid status value');
    }

    const updatedUser = await UserServices.banUser({ userId, status: status as UserStatus });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
        data: updatedUser,
    });
});



// const banUserController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
//     const userId = req.params.id;

//     const result = await UserServices.banUser(req.user, userId);
//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "User banned successfully",
//         data: result,
//     });
// });

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

const getUserProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const email = req.user.email;
    const result = await UserServices.getUserProfile(email);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result
    })
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

const updateUserRole = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { userId, newRole } = req.body;

    if (req.user.role !== UserRole.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update user roles');
    }

    const updatedUser = await UserServices.updateUserRole({ userId, newRole: newRole as UserRole });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: updatedUser,
    });
});


const getAdminStatsController = catchAsync(async (req: Request, res: Response) => {
    const stats = await UserServices.getAdminStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin statistics retrieved successfully",
        data: stats,
    });
});

export const userControllers = {
    createUser,
    createAdmin,
    getUserController,
    banUserController,
    updateUserController,
    getAllUsers,
    getUserProfile,
    updateUserRole,
    getAdminStatsController

}