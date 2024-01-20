import { User } from "../models/user.model";
import * as userDB from "../data/user.data";

export async function getUsers(): Promise<User[]> {
  try {
    return await userDB.getUsers();
  } catch (error) {
    throw error;
  }
}
