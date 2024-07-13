import { z } from "zod";

const createOrderSchema = z.object({
    mealId: z.string().optional(),
    orderDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    noMeal: z.boolean().optional(),
});

export { createOrderSchema };
