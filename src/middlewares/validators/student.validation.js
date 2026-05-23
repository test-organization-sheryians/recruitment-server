import { z } from "zod";

export const createStudentValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long"),

    email: z
      .string()
      .email("Invalid email format"),

    age: z
      .number()
      .min(5, "Age must be at least 5"),

    course: z
      .string()
      .min(2, "Course is required"),

    city: z
      .string()
      .min(2, "City is required")
  })
});

export const updateStudentValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    age: z.number().min(5).optional(),
    course: z.string().min(2).optional(),
    city: z.string().min(2).optional()
  })
});