import { query } from "../db";
import { PostableError } from "../middlewares/error.middleware";
import { User, UserParams } from "../models/user.model";

export async function getUserByUsername(username: string): Promise<User> {
  try {
    const user = (
      await query("SELECT * FROM users WHERE username = $1;", [username])
    ).rows[0];
    return user;
  } catch (error) {
    throw new PostableError("User doesn't exist", 403, "Data error", error);
  }
}

export async function createUser(data: UserParams): Promise<User> {
  console.log("ENTRA A CREATE DATA");

  const keys = Object.keys(data);
  const indices = keys.map((_, index) => `$${index + 1}`).join(",");
  const columns = keys.join(",");
  const values = Object.values(data);

  console.log(" -> ", data);

  try {
    return (
      await query(
        `INSERT INTO users (${columns}) VALUES (${indices})
           RETURNING id,username,email,firstname,lastname,createdat,updatedat;`,
        values
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Couldn't add user", 403, "Data error", error);
  }
}
