import { Router } from "express";
import {
  createPostController,
  deleteLikeFromPost,
  getPostsByUsernameController,
  getPostsController,
  giveLikeToPost,
  updatePost,
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
postRouter.post("/posts/:postId/like", giveLikeToPost);
postRouter.patch("/posts/:id", updatePost); //
postRouter.delete("/posts/:postId/like", deleteLikeFromPost);

export default postRouter;
