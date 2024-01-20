import { User, UserParams } from "../models/user.model";
import * as userDB from "../data/user.data";
import { PostableError } from "../middlewares/error.middleware";

export async function getUsers(): Promise<User[]> {
  try {
    return await userDB.getUsers();
  } catch (error) {
    throw error;
  }
}

export async function getUserByUsername(name: string): Promise<User> {
  try {
    const user = await userDB.getUserByUsername(name);
    if (!user)
      throw new PostableError("User doesn't exists", 403, "Error at service");

    return user;
  } catch (error) {
    throw error;
  }
}

export async function createUser(data: UserParams): Promise<User> {
  const { username } = data;
  try {
    console.log("ENTRA A CREATE SERVICE");
    const user = await userDB.getUserByUsername(username);
    if (user)
      throw new PostableError("Username already exists", 403, "Service Error");

    let userEmail: User | undefined = undefined;
    if (data.email) userEmail = await userDB.getUserByEmail(data.email);
    if (userEmail)
      throw new PostableError("Email already exists", 403, "Service Error");

    return await userDB.createUser(data);
  } catch (error) {
    throw error;
  }
}
