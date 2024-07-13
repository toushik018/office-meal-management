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
const date_fns_1 = require("date-fns");
const meal_validation_1 = require("./meal.validation");
const createMeal = (requester, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to create a meal");
    }
    // Validate allowedDays
    const allowedDaysValidation = meal_validation_1.allowedDaysSchema.safeParse(payload.allowedDays);
    if (!allowedDaysValidation.success) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid allowed days");
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
    const mealDate = new Date(payload.date);
    if (isNaN(mealDate.getTime())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid date format");
    }
    const meal = yield prisma_1.default.meal.create({
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
    let isRiceIncluded = meal.isRiceIncluded;
    if (payload.items) {
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
    // Delete related records in meal_schedules
    yield prisma_1.default.mealSchedule.deleteMany({
        where: { mealId },
    });
    // Delete related orders
    yield prisma_1.default.order.deleteMany({
        where: { mealId },
    });
    // Delete related meal items
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
const scheduleMeal = (requester, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to schedule meals");
    }
    const scheduleDate = new Date(payload.date);
    if (isNaN(scheduleDate.getTime())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid date format");
    }
    const meal = yield prisma_1.default.meal.findUnique({
        where: { id: payload.mealId },
        select: { allowedDays: true, name: true }, // Ensure 'name' is selected
    });
    if (!meal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
    }
    const dayOfWeek = (0, date_fns_1.getDay)(scheduleDate); // 0 (Sunday) to 6 (Saturday)
    const allowedDays = meal.allowedDays.map(day => day.toLowerCase());
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayName = daysOfWeek[dayOfWeek];
    if (!allowedDays.includes(dayName)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `This meal can only be scheduled on ${meal.allowedDays.join(", ")}`);
    }
    // Check if the meal is already scheduled more than twice within the allowed days in the current week
    const startWeek = (0, date_fns_1.startOfWeek)(scheduleDate);
    const endWeek = (0, date_fns_1.endOfWeek)(scheduleDate);
    const existingSchedules = yield prisma_1.default.mealSchedule.findMany({
        where: {
            mealId: payload.mealId,
            date: {
                gte: startWeek,
                lte: endWeek,
            },
        },
    });
    const scheduledDays = existingSchedules.map(schedule => daysOfWeek[(0, date_fns_1.getDay)(new Date(schedule.date))]);
    const countInAllowedDays = scheduledDays.filter(day => allowedDays.includes(day)).length;
    if (countInAllowedDays >= 2) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `The "${meal.name}" can only be scheduled a maximum of two days in a week`);
    }
    const scheduledMeal = yield prisma_1.default.mealSchedule.create({
        data: {
            mealId: payload.mealId,
            date: scheduleDate,
        },
    });
    return scheduledMeal;
});
const getScheduledMeals = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleDate = new Date(date);
    if (isNaN(scheduleDate.getTime())) {
        throw new Error("Invalid date format");
    }
    const startWeek = (0, date_fns_1.startOfWeek)(scheduleDate);
    const endWeek = (0, date_fns_1.endOfWeek)(scheduleDate);
    const scheduledMeals = yield prisma_1.default.meal.findMany({
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
});
const getMealChoicesForUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
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
});
exports.MealServices = { createMeal, updateMeal, deleteMeal, getMeals, scheduleMeal, getScheduledMeals, getMealChoicesForUsers };
