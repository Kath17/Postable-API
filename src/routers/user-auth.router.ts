import { Router } from "express";
import {
  loginController,
  signUpController,
} from "../controllers/user-auth.controller";
import { ValidateRequestMiddleware } from "../middlewares/validation.middleware";
import { userSchema, userSchemaLogin } from "../models/user.model";

export const authRouter = Router();

authRouter.post(
  "/login",
  ValidateRequestMiddleware(userSchemaLogin),
  loginController
);
authRouter.post(
  "/signup",
  ValidateRequestMiddleware(userSchema),
  signUpController
);
