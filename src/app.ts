import express from "express";
import { configDotenv } from "dotenv";
import { userRouter } from "./routers/user.router";
import { authRouter } from "./routers/user-auth.router";
import { postRouter } from "./routers/post.router";
import errorHandler from "./middlewares/error.middleware";
import { userProfileRouter } from "./routers/user-profile.router";
import likesRouter from "./routers/like.router";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
  console.log("auth: ", "test");
} else {
  configDotenv();
  console.log(process.env["PGDATABASE"]);
}

export const app = express();

app.use(express.json());

app.use(authRouter);
app.use("/users", userRouter);
app.use("/me", userProfileRouter);
app.use(postRouter);
app.use("/posts", likesRouter);

app.use(errorHandler);
