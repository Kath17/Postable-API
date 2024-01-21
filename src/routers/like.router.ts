import { Router } from "express";
import {
  giveLikeToPostController,
  deleteLikeFromPostController,
} from "../controllers/like.controller";
import { authenticateHandler } from "../middlewares/user-auth.middleware";

export const likesRouter = Router();

likesRouter.post(
  "/:postId/like",
  authenticateHandler,
  giveLikeToPostController
);
likesRouter.delete(
  "/:postId/like",
  authenticateHandler,
  deleteLikeFromPostController
);

export default likesRouter;
