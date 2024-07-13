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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = payload;
    const hashPassword = yield bcrypt_1.default.hash(password, 12);
    const userData = {
        name,
        email,
        password: hashPassword,
        role: role || "USER"
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUserData = yield transactionClient.user.create({
            data: userData,
        });
        const { password } = createdUserData, user = __rest(createdUserData, ["password"]);
        return user;
    }));
    return result;
});
// const updateUser = async (requester: any, userId: string, payload: Partial<UserCreateInput>) => {
//     // Check if the requester is trying to update their own details or if they are an admin
//     if (requester.id !== userId && requester.role !== UserRole.ADMIN) {
//         throw new Error("You are not authorized to update this user");
//     }
//     const user = await prisma.user.findUnique({
//         where: { id: userId },
//     });
//     if (!user) {
//         throw new Error("User not found");
//     }
//     const updatedUser = await prisma.user.update({
//         where: { id: userId },
//         data: payload,
//     });
//     return updatedUser;
// };
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUserProfile = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });
    const updatedUserProfile = yield prisma_1.default.user.update({
        where: {
            id: userId
        },
        data: Object.assign({}, userData)
    });
    return updatedUserProfile;
});
// const banUser = async (requester: any, userId: string) => {
//     if (requester.role !== UserRole.ADMIN) {
//         throw new Error("You are not authorized to ban this user");
//     }
//     const user = await prisma.user.findUnique({
//         where: { id: userId },
//     });
//     if (!user) {
//         throw new Error("User not found");
//     }
//     const bannedUser = await prisma.user.update({
//         where: { id: userId },
//         data: { status: "BANNED" },
//     });
//     return bannedUser;
// };
const banUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, status } = payload;
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { status: status },
    });
    return updatedUser;
});
const getUserById = (requester, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Users can only fetch their own details unless they are an admin
    if (requester.id !== userId && requester.role !== "ADMIN") {
        throw new Error("You are not authorized to view this user");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
const getAllUsers = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, username, email, role, status } = params, filterData = __rest(params, ["searchTerm", "username", "email", "role", "status"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: ["name", "email"].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    if (username) {
        andCondition.push({
            name: {
                contains: username,
                mode: "insensitive"
            }
        });
    }
    if (email) {
        andCondition.push({
            email: {
                contains: email,
                mode: "insensitive"
            }
        });
    }
    if (status) {
        andCondition.push({
            status: {
                equals: status
            }
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereCondition = {
        AND: andCondition
    };
    const result = yield prisma_1.default.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: "desc"
        }
    });
    const total = yield prisma_1.default.user.count({
        where: whereCondition
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getUserProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield prisma_1.default.user.findUnique({
        where: {
            email
        }
    });
    return userProfile;
});
const updateUserRole = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newRole } = payload;
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { role: newRole },
    });
    return updatedUser;
});
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield prisma_1.default.user.count();
    const totalMeals = yield prisma_1.default.meal.count();
    const totalOrders = yield prisma_1.default.order.count();
    return {
        totalUsers,
        totalMeals,
        totalOrders,
        // Placeholder for recent activities, modify as needed
        recentActivities: [],
    };
});
exports.UserServices = {
    createUser,
    updateUser,
    banUser,
    getUserById,
    getAllUsers,
    getUserProfile,
    updateUserRole,
    getAdminStats
};
