import { Router } from "express";

export const userRouter = Router();

userRouter.get("/users", async (req, res) => {});

userRouter.post("/users", async (req, res) => {});

userRouter.get("/users/:id", async (req, res) => {});

userRouter.patch("/users/:id", async (req, res) => {});

userRouter.delete("/users/:id", async (req, res) => {});
