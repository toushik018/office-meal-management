import { z } from "zod";

const allowedDaysSchema = z.array(z.enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]));

const createMealSchema = z.object({
    name: z.string(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    items: z.array(z.string()),
});

const updateMealSchema = z.object({
    name: z.string().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }).optional(),
    items: z.array(z.string()).optional(),
});

export { createMealSchema, updateMealSchema, allowedDaysSchema };
