import { PostableError } from "../middlewares/error.middleware";
import * as likeDB from "../data/like.data";
import * as postDB from "../data/post.data";

export async function giveLike(
  postId: string,
  userId: string
): Promise<Boolean> {
  try {
    const post = await postDB.getPostById(postId);
    if (!post)
      throw new PostableError("Post doesn't exist", 404, "Error at service");

    const like = await getLikeByIds(userId, postId);
    if (like)
      throw new PostableError("Post already liked", 403, "Service Error");

    return await likeDB.giveLike(postId, userId);
  } catch (error) {
    throw error;
  }
}

export async function getLikeByIds(userId: string, postId: string) {
  try {
    return await likeDB.getLikeByIds(userId, postId);
  } catch (error) {
    throw error;
  }
}
