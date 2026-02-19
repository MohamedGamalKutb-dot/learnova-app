import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

// Register Schema
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be at most 50 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters")
            .max(100, "Password is too long"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

// Profile Update Schema
export const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Please enter a valid email"),
    bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
    phone: z.string().optional(),
});
