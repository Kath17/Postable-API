import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string({
      required_error: "User is required",
      invalid_type_error: "User should be string",
    })
    .min(6, "User should have at least 6 characters"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password should be string",
    })
    .min(6, "Password should have at least 6 characters"),
  role: z
    .enum(["user", "admin"], {
      errorMap: (issue, ctx) => {
        return { message: "Role only can be 'user' or 'admin'" };
      },
    })
    .optional()
    .default("user"),
  email: z
    .string({
      invalid_type_error: "Email should be a string",
    })
    .min(5, "Email should have at least 5 characters")
    .optional(),
  firstName: z
    .string({
      invalid_type_error: "First Name should be string",
    })
    .min(3, "First Name should have at least 3 characters")
    .optional(),
  lastName: z
    .string({
      invalid_type_error: "Last Name should be string",
    })
    .min(3, "Last Name should have at least 3 characters")
    .optional(),
  createdAt: z
    .string({
      invalid_type_error: "CreatedAt should be a date.",
    })
    .optional(),
  updatedAt: z
    .string({
      invalid_type_error: "updatedAt should be a date.",
    })
    .optional(),
});

export const userSchemaLogin = userSchema.omit({
  role: true,
  email: true,
  firstName: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,
});

export const userSchemaEdit = userSchema.omit({
  username: true,
  password: true,
  role: true,
  createdAt: true,
});

export type UserParams = z.infer<typeof userSchema>;
export type User = UserParams & { id: number };
export type UserParamsEdit = z.infer<typeof userSchemaEdit>;
