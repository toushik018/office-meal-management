import { z } from "zod";

const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    role: z.enum(["USER", "ADMIN"]).optional(), // Role can be either USER or ADMIN
});


const createAdminSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userValidationSchema = {
    createUserSchema,
    createAdminSchema
};
