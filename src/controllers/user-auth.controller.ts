import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PostableError } from "../middlewares/error.middleware";
import { getDate } from "../utils/getDate";
import { createUser, getUserByUsername } from "../services/user-auth.service";

const jwtSecret = "ultra-secret";

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    const validPass = await bcrypt.compare(password, user.password);

    if (validPass) {
      const payload = { userId: user.id, userRole: user.role };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "4h" });
      res
        .status(200)
        .json({ ok: true, message: "Login exitoso", data: { token } });
    } else {
      throw new PostableError(
        "Invalid credentials",
        403,
        "Error at controllers"
      );
    }
  } catch (error) {
    next(error);
  }
};

const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const costFactor = 10;
    let currentDate = getDate();

    let newUser = req.body;
    newUser.password = await bcrypt.hash(newUser.password, costFactor);
    newUser.createdAt = currentDate;
    newUser.updatedAt = currentDate;

    newUser = await createUser(newUser);

    res.status(201).json({
      ok: true,
      message: "Register successful",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export { loginController, signUpController };
