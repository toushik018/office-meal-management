"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    mealId: zod_1.z.string().optional(),
    orderDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    noMeal: zod_1.z.boolean().optional(),
});
exports.createOrderSchema = createOrderSchema;
