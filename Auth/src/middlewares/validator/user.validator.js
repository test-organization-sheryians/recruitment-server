import { z } from "zod";

export const UserValidator = z.object({
  email: z
    .string()
    .email({
      message: "A valid email address is required",
    }),

  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters long",
    }),

  firstName: z
    .string({
      message: "First name must be a string",
    })
    .min(1, {
      message: "First name is required",
    }),

  lastName: z
    .string({
      message: "Last name must be a string",
    })
    .min(1, {
      message: "Last name is required",
    }),
});