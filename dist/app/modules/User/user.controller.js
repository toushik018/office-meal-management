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
exports.userControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../utils/pick"));
const user_constant_1 = require("./user.constant");
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User Created successfully",
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = Object.assign(Object.assign({}, req.body), { role: "ADMIN" });
    const result = yield user_service_1.UserServices.createUser(adminData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Admin registered successfully",
        data: result,
    });
}));
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
const updateUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const userData = req.body;
    const result = yield user_service_1.UserServices.updateUser(userId, userData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User profile updated successfully",
        data: result
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield user_service_1.UserServices.getAllUsers(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const banUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, status } = req.body;
    if (req.user.role !== 'ADMIN') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update user status');
    }
    if (!Object.values(client_1.UserStatus).includes(status)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid status value');
    }
    const updatedUser = yield user_service_1.UserServices.banUser({ userId, status: status });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User status updated successfully',
        data: updatedUser,
    });
}));
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
const getUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield user_service_1.UserServices.getUserById(req.user, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
}));
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const result = yield user_service_1.UserServices.getUserProfile(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result
    });
}));
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
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newRole } = req.body;
    if (req.user.role !== client_1.UserRole.ADMIN) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update user roles');
    }
    const updatedUser = yield user_service_1.UserServices.updateUserRole({ userId, newRole: newRole });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User role updated successfully',
        data: updatedUser,
    });
}));
const getAdminStatsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield user_service_1.UserServices.getAdminStats();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin statistics retrieved successfully",
        data: stats,
    });
}));
exports.userControllers = {
    createUser,
    createAdmin,
    getUserController,
    banUserController,
    updateUserController,
    getAllUsers,
    getUserProfile,
    updateUserRole,
    getAdminStatsController
};
