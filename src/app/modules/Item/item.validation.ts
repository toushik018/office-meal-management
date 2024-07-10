import { z } from "zod";

const createItemSchema = z.object({
    name: z.string(),
    category: z.string(),
});


export { createItemSchema };
