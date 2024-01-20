import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PostableError } from "../middlewares/error.middleware";
import { createUser, getUserByUsername } from "../services/user.service";
import { User } from "../models/user.model";
import { getDate } from "../utils/getDate";

const jwtSecret = "ultra-secret";

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    console.log("username: ", username, " password ", password);
    const user = await getUserByUsername(username);
    const validPass = await bcrypt.compare(password, user.password);

    if (validPass) {
      const payload = { userId: user.id, userRole: user.role };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "4h" });
      res.json({ ok: true, message: "Login exitoso", data: { token } });
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
    console.log("newUser: ", newUser);

    newUser = await createUser(newUser);

    const dataUser: Partial<User> = { ...newUser };
    delete dataUser.password;
    delete dataUser.role;

    res.status(201).json({
      ok: true,
      message: "Register successful",
      data: dataUser,
    });
  } catch (error) {
    next(error);
  }
};

export { loginController, signUpController };
