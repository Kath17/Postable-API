import { User, UserParamsEdit } from "../models/user.model";
import * as userProfileDB from "../data/user-profile.data";
import { PostableError } from "../middlewares/error.middleware";

export async function getUserProfileById(id: string): Promise<User> {
  try {
    const user = await userProfileDB.getUserProfileById(id);
    if (!user)
      throw new PostableError("User doesn't exists", 403, "Error at service");

    return user;
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(
  data: UserParamsEdit,
  id: string
): Promise<User> {
  try {
    const user = await userProfileDB.getUserProfileById(id);
    if (!user)
      throw new PostableError("User doesn't exists", 403, "Error at service");

    return await userProfileDB.updateUserProfile(data, id);
  } catch (error) {
    throw error;
  }
}

export async function deleteUserProfile(id: string): Promise<User> {
  try {
    const user = await userProfileDB.getUserProfileById(id);
    if (!user)
      throw new PostableError("User doesn't exists", 403, "Error at service");

    return await userProfileDB.deleteUserProfile(id);
  } catch (error) {
    throw error;
  }
}
