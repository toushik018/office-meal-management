import httpStatus from "http-status"; // Make sure to install http-status package
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

const createMeal = async (requester: any, payload: { name: string; date: Date; items: string[] }) => {
    if (requester.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create a meal");
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

    const meal = await prisma.meal.create({
        data: {
            name: payload.name,
            date: payload.date,
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

    // Default to current value
    let isRiceIncluded = meal.isRiceIncluded;

    if (payload.items) {
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

        // Set isRiceIncluded based on the presence of a rice item in the updated items list
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

    // Delete related meal items first
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

export const MealServices = { createMeal, updateMeal, deleteMeal, getMeals };
