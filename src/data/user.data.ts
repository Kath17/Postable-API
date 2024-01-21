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
    return (await query("SELECT * FROM users WHERE email = $1;", [email]))
      .rows[0];
  } catch (error) {
    throw new PostableError("Email isn't registered", 403, "Data error", error);
  }
}

export async function getUserById(id: number) {
  try {
    return (await query("SELECT * FROM users WHERE id = $1;", [id])).rows[0];
  } catch (error) {
    throw new PostableError("User doesn't exist", 403, "Data error", error);
  }
}
