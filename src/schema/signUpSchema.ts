import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(2, "Username must be of atlease 2 characters")
    .max(10, "Username cannot be more than 10 characters")
    .regex(/^[A-Za-z0-9]+$/, "Username can only contain a-z or A-Z or 0-9");

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

