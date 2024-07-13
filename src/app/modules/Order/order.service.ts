import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { endOfWeek, isBefore, startOfWeek } from "date-fns";

interface CreateOrderPayload {
    mealId?: string;
    orderDate: Date;
    noMeal?: boolean;
}

const createOrder = async (requester: any, payload: CreateOrderPayload) => {
    if (requester.role !== "USER") {
        throw new AppError(httpStatus.FORBIDDEN, "Only users can place orders");
    }

    const orderDate = new Date(payload.orderDate);

    if (isNaN(orderDate.getTime())) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid order date");
    }

    // Prevent modifications to past orders
    if (isBefore(orderDate, new Date())) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot modify past orders");
    }

    const data: any = {
        userId: requester.id,
        orderDate: orderDate,
        noMeal: payload.noMeal || false,
    };

    if (!payload.noMeal) {
        if (!payload.mealId) {
            throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required when noMeal is false");
        }
        data.mealId = payload.mealId;
    }

    const order = await prisma.order.create({
        data: data,
    });

    return order;
};


const getOrdersByUser = async (userId: string) => {
    const orders = await prisma.order.findMany({
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
};

const updateOrder = async (requester: any, orderId: string, payload: { mealId?: string; noMeal?: boolean }) => {
    if (requester.role !== "USER") {
        throw new AppError(httpStatus.FORBIDDEN, "Only users can update orders");
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    // Prevent modifications to past orders
    if (isBefore(order.orderDate, new Date())) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot modify past orders");
    }

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
            mealId: payload.mealId,
            noMeal: payload.noMeal,
        },
    });

    return updatedOrder;
};


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


const getWeeklyMealSchedules = async (userId: string, weekStart: string) => {
    const start = startOfWeek(new Date(weekStart), { weekStartsOn: 0 }); // assuming week starts on Sunday
    const end = endOfWeek(new Date(weekStart), { weekStartsOn: 0 });

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid weekStart date");
    }

    const meals = await prisma.mealSchedule.findMany({
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

    const orders = await prisma.order.findMany({
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
};


const getMealChoices = async (requester: any) => {
    if (requester.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view meal choices");
    }

    const mealChoices = await prisma.order.findMany({
        include: {
            user: true,
            meal: true,
        },
    });

    return mealChoices;
};


export const OrderServices = {
    createOrder,
    getMealChoices,
    getOrdersByUser,
    updateOrder,
    getWeeklyMealSchedules
}