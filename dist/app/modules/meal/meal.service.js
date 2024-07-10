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
exports.MealServices = void 0;
const http_status_1 = __importDefault(require("http-status")); // Make sure to install http-status package
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createMeal = (requester, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to create a meal");
    }
    // Constraint checks
    const riceItem = yield prisma_1.default.item.findFirst({
        where: {
            id: { in: payload.items },
            category: "Starch",
        },
    });
    if (!riceItem) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A meal must have a rice item to be complete");
    }
    const proteinItems = yield prisma_1.default.item.findMany({
        where: {
            id: { in: payload.items },
            category: "Protein",
        },
    });
    if (proteinItems.length > 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A meal cannot have two protein sources at a time");
    }
    if (payload.items.length < 3) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A meal must have at least 3 items to be complete");
    }
    const meal = yield prisma_1.default.meal.create({
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
});
const updateMeal = (requester, mealId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (requester.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to update a meal");
    }
    const meal = yield prisma_1.default.meal.findUnique({
        where: { id: mealId },
        include: { mealItems: true },
    });
    if (!meal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
    }
    // Default to current value
    let isRiceIncluded = meal.isRiceIncluded;
    if (payload.items) {
        // Constraint checks
        const riceItem = yield prisma_1.default.item.findFirst({
            where: {
                id: { in: payload.items },
                category: "Starch",
            },
        });
        if (!riceItem) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A meal must have a rice item to be complete");
        }
        const proteinItems = yield prisma_1.default.item.findMany({
            where: {
                id: { in: payload.items },
                category: "Protein",
            },
        });
        if (proteinItems.length > 1) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A meal cannot have two protein sources at a time");
        }
        if (payload.items.length < 3) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A meal must have at least 3 items to be complete");
        }
        // Set isRiceIncluded based on the presence of a rice item in the updated items list
        isRiceIncluded = !!riceItem;
    }
    const updatedMeal = yield prisma_1.default.meal.update({
        where: { id: mealId },
        data: {
            name: payload.name,
            date: payload.date,
            isRiceIncluded,
            mealItems: {
                deleteMany: { mealId },
                create: (_a = payload.items) === null || _a === void 0 ? void 0 : _a.map((itemId) => ({
                    itemId,
                })),
            },
        },
    });
    return updatedMeal;
});
const deleteMeal = (requester, mealId) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to delete a meal");
    }
    const meal = yield prisma_1.default.meal.findUnique({
        where: { id: mealId },
    });
    if (!meal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
    }
    // Delete related meal items first
    yield prisma_1.default.mealItem.deleteMany({
        where: { mealId },
    });
    // Now delete the meal
    yield prisma_1.default.meal.delete({
        where: { id: mealId },
    });
});
const getMeals = (requester) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN" && requester.role !== "USER") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to view meals");
    }
    const meals = yield prisma_1.default.meal.findMany({
        include: {
            mealItems: {
                include: {
                    item: true,
                },
            },
        },
    });
    return meals;
});
exports.MealServices = { createMeal, updateMeal, deleteMeal, getMeals };
