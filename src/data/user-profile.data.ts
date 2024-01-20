import { query } from "../db";
import { PostableError } from "../middlewares/error.middleware";
import { User, UserParamsEdit } from "../models/user.model";
import { getDate } from "../utils/getDate";
import { StringifyObject } from "../utils/stringifyObject.utils";

export async function getUserProfileById(id: string): Promise<User> {
  try {
    return (
      await query(
        "SELECT id,username,email,firstname,lastname,createdat,updatedat  FROM users WHERE id = $1;",
        [id]
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Error getting user", 403, "Data error", error);
  }
}

export async function updateUserProfile(
  data: UserParamsEdit,
  id: string
): Promise<User> {
  try {
    data.updatedAt = getDate();
    const stringifyObject = StringifyObject(data);
    return (
      await query(
        `UPDATE users SET ${stringifyObject}
    WHERE id = $1 RETURNING id,username,email,firstname,lastname,createdat,updatedat;`,
        [id]
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Error updating user", 403, "Data error", error);
  }
}

export async function deleteUserProfile(id: string): Promise<User> {
  try {
    return (
      await query(
        `DELETE FROM users WHERE id = $1 RETURNING id,username,email,firstname,lastname;`,
        [id]
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Error deleteing user", 500, "DataError");
  }
}
