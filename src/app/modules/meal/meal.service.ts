import httpStatus from "http-status"; // Make sure to install http-status package
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { endOfWeek, getDay, startOfWeek } from "date-fns";
import { allowedDaysSchema } from "./meal.validation";


interface ScheduleMealPayload {
    date: string;
    mealId: string;
}


const createMeal = async (requester: any, payload: { name: string; date: string; allowedDays: string[], items: string[] }) => {
    if (requester.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create a meal");
    }

    // Validate allowedDays
    const allowedDaysValidation = allowedDaysSchema.safeParse(payload.allowedDays);
    if (!allowedDaysValidation.success) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid allowed days");
    }

    // Constraint checks
    const riceItem = await prisma.item.findFirst({
        where: {
            id: { in: payload.items },
            category: "Starch",
        },
    });

    if (!riceItem) {
        throw new AppError(httpStatus.BAD_REQUEST, "A meal must have a rice item to be complete");
    }

    const proteinItems = await prisma.item.findMany({
        where: {
            id: { in: payload.items },
            category: "Protein",
        },
    });

    if (proteinItems.length > 1) {
        throw new AppError(httpStatus.BAD_REQUEST, "A meal cannot have two protein sources at a time");
    }

    if (payload.items.length < 3) {
        throw new AppError(httpStatus.BAD_REQUEST, "A meal must have at least 3 items to be complete");
    }

    const mealDate = new Date(payload.date);
    if (isNaN(mealDate.getTime())) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format");
    }

    const meal = await prisma.meal.create({
        data: {
            name: payload.name,
            date: mealDate,
            allowedDays: payload.allowedDays,
            isRiceIncluded: !!riceItem,
            mealItems: {
                create: payload.items.map((itemId) => ({
                    itemId,
                })),
            },
        },
    });

    return meal;
};


const updateMeal = async (requester: any, mealId: string, payload: { name?: string; date?: Date; items?: string[] }) => {
    if (requester.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update a meal");
    }

    const meal = await prisma.meal.findUnique({
        where: { id: mealId },
        include: { mealItems: true },
    });

    if (!meal) {
        throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
    }

    let isRiceIncluded = meal.isRiceIncluded;

    if (payload.items) {
        const riceItem = await prisma.item.findFirst({
            where: {
                id: { in: payload.items },
                category: "Starch",
            },
        });

        if (!riceItem) {
            throw new AppError(httpStatus.BAD_REQUEST, "A meal must have a rice item to be complete");
        }

        const proteinItems = await prisma.item.findMany({
            where: {
                id: { in: payload.items },
                category: "Protein",
            },
        });

        if (proteinItems.length > 1) {
            throw new AppError(httpStatus.BAD_REQUEST, "A meal cannot have two protein sources at a time");
        }

        if (payload.items.length < 3) {
            throw new AppError(httpStatus.BAD_REQUEST, "A meal must have at least 3 items to be complete");
        }

        isRiceIncluded = !!riceItem;
    }

    const updatedMeal = await prisma.meal.update({
        where: { id: mealId },
        data: {
            name: payload.name,
            date: payload.date,
            isRiceIncluded,
            mealItems: {
                deleteMany: { mealId },
                create: payload.items?.map((itemId) => ({
                    itemId,
                })),
            },
        },
    });

    return updatedMeal;
};

const deleteMeal = async (requester: any, mealId: string) => {
    if (requester.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete a meal");
    }

    const meal = await prisma.meal.findUnique({
        where: { id: mealId },
    });

    if (!meal) {
        throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
    }

    // Delete related records in meal_schedules
    await prisma.mealSchedule.deleteMany({
        where: { mealId },
    });

    // Delete related orders
    await prisma.order.deleteMany({
        where: { mealId },
    });

    // Delete related meal items
    await prisma.mealItem.deleteMany({
        where: { mealId },
    });

    // Now delete the meal
    await prisma.meal.delete({
        where: { id: mealId },
    });
};



const getMeals = async (requester: any) => {
    if (requester.role !== "ADMIN" && requester.role !== "USER") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view meals");
    }

    const meals = await prisma.meal.findMany({
        include: {
            mealItems: {
                include: {
                    item: true,
                },
            },
        },
    });

    return meals;
};




const scheduleMeal = async (requester: any, payload: ScheduleMealPayload) => {
    if (requester.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to schedule meals");
    }

    const scheduleDate = new Date(payload.date);
    if (isNaN(scheduleDate.getTime())) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format");
    }

    const meal = await prisma.meal.findUnique({
        where: { id: payload.mealId },
        select: { allowedDays: true, name: true }, // Ensure 'name' is selected
    });

    if (!meal) {
        throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
    }

    const dayOfWeek = getDay(scheduleDate); // 0 (Sunday) to 6 (Saturday)
    const allowedDays = meal.allowedDays.map(day => day.toLowerCase());

    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayName = daysOfWeek[dayOfWeek];

    if (!allowedDays.includes(dayName)) {
        throw new AppError(httpStatus.BAD_REQUEST, `This meal can only be scheduled on ${meal.allowedDays.join(", ")}`);
    }

    // Check if the meal is already scheduled more than twice within the allowed days in the current week
    const startWeek = startOfWeek(scheduleDate);
    const endWeek = endOfWeek(scheduleDate);

    const existingSchedules = await prisma.mealSchedule.findMany({
        where: {
            mealId: payload.mealId,
            date: {
                gte: startWeek,
                lte: endWeek,
            },
        },
    });

    const scheduledDays = existingSchedules.map(schedule => daysOfWeek[getDay(new Date(schedule.date))]);

    const countInAllowedDays = scheduledDays.filter(day => allowedDays.includes(day)).length;

    if (countInAllowedDays >= 2) {
        throw new AppError(httpStatus.BAD_REQUEST, `The "${meal.name}" can only be scheduled a maximum of two days in a week`);
    }

    const scheduledMeal = await prisma.mealSchedule.create({
        data: {
            mealId: payload.mealId,
            date: scheduleDate,
        },
    });

    return scheduledMeal;
};



const getScheduledMeals = async (date: string) => {
    const scheduleDate = new Date(date);

    if (isNaN(scheduleDate.getTime())) {
        throw new Error("Invalid date format");
    }

    const startWeek = startOfWeek(scheduleDate);
    const endWeek = endOfWeek(scheduleDate);

    const scheduledMeals = await prisma.meal.findMany({
        where: {
            date: {
                gte: startWeek,
                lte: endWeek
            }
        },
        include: {
            mealItems: {
                include: {
                    item: true
                }
            }
        }
    });

    return scheduledMeals;
};

const getMealChoicesForUsers = async () => {
    const orders = await prisma.order.findMany({
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
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,

                },
            },
        },
    });

    return orders;
};

export const MealServices = { createMeal, updateMeal, deleteMeal, getMeals, scheduleMeal, getScheduledMeals, getMealChoicesForUsers };
