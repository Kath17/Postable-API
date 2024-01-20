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
});

export const userSchemaLogin = z.object({
  username: z
    .string({
      required_error: "User es requerido",
      invalid_type_error: "User debe ser un string",
    })
    .min(6, "Password should have at least 6 characters"),
  password: z
    .string({
      required_error: "Password es requerido",
      invalid_type_error: "Password debe ser un string",
    })
    .min(6, "Password should have at least 6 characters"),
});

export type UserParams = z.infer<typeof userSchema>;
export type User = UserParams & { id: number };
