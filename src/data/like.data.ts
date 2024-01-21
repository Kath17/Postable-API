import { query } from "../db";
import { PostableError } from "../middlewares/error.middleware";
import { getDate } from "../utils/getDate";

export async function giveLike(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    await query(
      `INSERT INTO likes (postId,userId,createdAt) VALUES ($1,$2,$3);`,
      [postId, userId, getDate()]
    );
    return true;
  } catch (error) {
    throw new PostableError("Couldn't liked post", 403, "Data Error", error);
  }
}

export async function dislike(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    await query(`DELETE FROM likes WHERE postId = $1 AND userId = $2;`, [
      postId,
      userId,
    ]);
    return true;
  } catch (error) {
    throw new PostableError("Couldn't be disliked", 403, "Data Error", error);
  }
}

export async function getLikeByIds(userId: string, postId: string) {
  try {
    return (
      await query(`SELECT * FROM likes WHERE userId = $1 AND postId = $2;`, [
        userId,
        postId,
      ])
    ).rows[0];
  } catch (error) {
    throw new PostableError("Like wasn't given yet", 403, "Data Error", error);
  }
}
