import { Router } from "express";
import {
  createPostController,
  getPostsByUsernameController,
  getPostsController,
  updatePostController,
} from "../controllers/post.controller";
import { authenticateHandler } from "../middlewares/user-auth.middleware";
import { postSchema } from "../models/post.model";
import { ValidateRequestMiddleware } from "../middlewares/validation.middleware";

export const postRouter = Router();

postRouter.get("/", getPostsController);
postRouter.get("/:username", getPostsByUsernameController);
postRouter.post(
  "/posts",
  authenticateHandler,
  ValidateRequestMiddleware(postSchema),
  createPostController
);
postRouter.patch(
  "/posts/:id",
  authenticateHandler,
  ValidateRequestMiddleware(postSchema),
  updatePostController
);

export default postRouter;
