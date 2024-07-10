"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealSchema = exports.createMealSchema = void 0;
const zod_1 = require("zod");
const createMealSchema = zod_1.z.object({
    name: zod_1.z.string(),
    date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    items: zod_1.z.array(zod_1.z.string()),
});
exports.createMealSchema = createMealSchema;
const updateMealSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }).optional(),
    items: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateMealSchema = updateMealSchema;
