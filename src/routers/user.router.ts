import { Router } from "express";
import { getUsersController } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/", getUsersController);
