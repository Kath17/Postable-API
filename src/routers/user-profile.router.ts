import { Router } from "express";
import {
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user-profile.controller";
import { authenticateHandler } from "../middlewares/user-auth.middleware";
import { ValidateRequestMiddleware } from "../middlewares/validation.middleware";
import { userSchemaEdit } from "../models/user.model";

export const userProfileRouter = Router();

userProfileRouter.get("/", authenticateHandler, getUserProfile);
userProfileRouter.patch(
  "/",
  authenticateHandler,
  ValidateRequestMiddleware(userSchemaEdit),
  updateUserProfile
);
userProfileRouter.delete("/", authenticateHandler, deleteUserProfile);
