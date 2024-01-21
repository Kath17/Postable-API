import { z } from "zod";

export const postSchema = z.object({
  userid: z.number().int().positive().optional(),
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content should be a string",
    })
    .min(1, "Content should have at least 1 character"),
  createdAt: z
    .string({
      invalid_type_error: "CreatedAt should be a Date",
    })
    .optional(),
  updatedAt: z
    .string({
      invalid_type_error: "UpdatedAt should be a Date",
    })
    .optional(),
  likesCount: z
    .number({
      invalid_type_error: "likesCount should be a number",
    })
    .optional(),
});

export const postUpdateSchema = postSchema.partial();

export type PostParams = z.infer<typeof postSchema>;

export type Post = PostParams & {
  id: number;
};

export type PostFilters = {
  "posts.userId"?: string;
};
