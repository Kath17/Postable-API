import { query } from "../db";
import { PostableError } from "../middlewares/error.middleware";
import { User } from "../models/user.model";

export async function getUsers(): Promise<User[]> {
  try {
    return (await query("SELECT * FROM users;")).rows;
  } catch (error) {
    throw new PostableError("Couldn't get users", 403, "Data error", error);
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const user = (await query("SELECT * FROM users WHERE email = $1;", [email]))
      .rows[0];
    return user;
  } catch (error) {
    throw new PostableError("Email isn't registered", 403, "Data error", error);
  }
}
