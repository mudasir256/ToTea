import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(320);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(200, "Name is too long");

export const contactNumberSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid contact number")
  .max(32, "Contact number is too long")
  .regex(/^[+]?[\d\s().-]{7,32}$/, "Enter a valid phone number");

export const addressSchema = z.object({
  address_line_1: z.string().trim().min(3, "Address is required").max(200),
  address_line_2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  postal_code: z.string().trim().min(3, "Postal code is required").max(20),
  country: z.string().trim().min(2).max(100).default("US"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileUpdateSchema = z.object({
  full_name: fullNameSchema,
  contact_number: contactNumberSchema.optional().or(z.literal("")),
  address_line_1: z.string().trim().max(200).optional().or(z.literal("")),
  address_line_2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
});

export function normalizePhone(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isSafeReturnPath(path: string | null | undefined): path is string {
  if (!path) return false;
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}
