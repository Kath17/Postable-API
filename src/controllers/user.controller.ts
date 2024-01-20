import { NextFunction, Request, Response } from "express";
import { getUsers } from "../services/user.service";
import { PostableError } from "../middlewares/error.middleware";

export async function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getUsers();
    res.status(200).json({ ok: true, message: "List of users", data: users });
  } catch (error) {
    if (error instanceof PostableError) {
      next(error);
    } else {
      next(
        new PostableError(
          "Error obtaining list of users",
          500,
          "ControllerError",
          error
        )
      );
    }
  }
}
