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
exports.OrderServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const date_fns_1 = require("date-fns");
const createOrder = (requester, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "USER") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only users can place orders");
    }
    const orderDate = new Date(payload.orderDate);
    if (isNaN(orderDate.getTime())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid order date");
    }
    // Prevent modifications to past orders
    if ((0, date_fns_1.isBefore)(orderDate, new Date())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot modify past orders");
    }
    const data = {
        userId: requester.id,
        orderDate: orderDate,
        noMeal: payload.noMeal || false,
    };
    if (!payload.noMeal) {
        if (!payload.mealId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Meal ID is required when noMeal is false");
        }
        data.mealId = payload.mealId;
    }
    const order = yield prisma_1.default.order.create({
        data: data,
    });
    return order;
});
const getOrdersByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: { userId },
        include: {
            meal: {
                include: {
                    mealItems: {
                        include: {
                            item: true,
                        },
                    },
                },
            },
            user: true,
        },
    });
    return orders;
});
const updateOrder = (requester, orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "USER") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only users can update orders");
    }
    const order = yield prisma_1.default.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Prevent modifications to past orders
    if ((0, date_fns_1.isBefore)(order.orderDate, new Date())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot modify past orders");
    }
    const updatedOrder = yield prisma_1.default.order.update({
        where: { id: orderId },
        data: {
            mealId: payload.mealId,
            noMeal: payload.noMeal,
        },
    });
    return updatedOrder;
});
// const getWeeklyMealSchedules = async (userId: string, weekStart: string) => {
//     const start = startOfWeek(new Date(weekStart));
//     const end = endOfWeek(new Date(weekStart));
//     const meals = await prisma.mealSchedule.findMany({
//         where: {
//             date: {
//                 gte: start,
//                 lte: end,
//             },
//         },
//         include: {
//             meal: {
//                 include: {
//                     mealItems: {
//                         include: {
//                             item: true,
//                         },
//                     },
//                 },
//             },
//         },
//     });
//     const orders = await prisma.order.findMany({
//         where: {
//             userId,
//             orderDate: {
//                 gte: start,
//                 lte: end,
//             },
//         },
//         include: {
//             meal: {
//                 include: {
//                     mealItems: {
//                         include: {
//                             item: true,
//                         },
//                     },
//                 },
//             },
//         },
//     });
//     return { meals, orders };
// };
const getWeeklyMealSchedules = (userId, weekStart) => __awaiter(void 0, void 0, void 0, function* () {
    const start = (0, date_fns_1.startOfWeek)(new Date(weekStart), { weekStartsOn: 0 }); // assuming week starts on Sunday
    const end = (0, date_fns_1.endOfWeek)(new Date(weekStart), { weekStartsOn: 0 });
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid weekStart date");
    }
    const meals = yield prisma_1.default.mealSchedule.findMany({
        where: {
            date: {
                gte: start,
                lte: end,
            },
        },
        include: {
            meal: {
                include: {
                    mealItems: {
                        include: {
                            item: true,
                        },
                    },
                },
            },
        },
    });
    const orders = yield prisma_1.default.order.findMany({
        where: {
            userId,
            orderDate: {
                gte: start,
                lte: end,
            },
        },
        include: {
            meal: {
                include: {
                    mealItems: {
                        include: {
                            item: true,
                        },
                    },
                },
            },
        },
    });
    return { meals, orders };
});
const getMealChoices = (requester) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to view meal choices");
    }
    const mealChoices = yield prisma_1.default.order.findMany({
        include: {
            user: true,
            meal: true,
        },
    });
    return mealChoices;
});
exports.OrderServices = {
    createOrder,
    getMealChoices,
    getOrdersByUser,
    updateOrder,
    getWeeklyMealSchedules
};
