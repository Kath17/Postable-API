import { Router } from "express";
import { getUsersController } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/users", getUsersController);
userRouter.get("/users/:id", async (req, res) => {}); //

userRouter.post("/users", async (req, res) => {});

userRouter.patch("/users/:id", async (req, res) => {}); //
userRouter.delete("/users/:id", async (req, res) => {}); //
