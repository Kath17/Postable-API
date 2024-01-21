import { NextFunction, Request, Response } from "express";
import {
  getPostById,
  updateDislikeInPost,
  updateLikeInPost,
} from "../services/post.service";
import { PostableError } from "../middlewares/error.middleware";
import { giveLike, dislike } from "../services/like.service";
import { getUserById } from "../services/user.service";

export async function giveLikeToPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { postId } = req.params;
    const userId = String(req.userId);

    const post = await getPostById(postId);
    if (!post)
      throw new PostableError("Post not found", 404, "Controller Error");

    await giveLike(postId, userId);
    const likedPost = await updateLikeInPost(postId);

    let username: String | undefined = undefined;
    if (post.userid) username = (await getUserById(post.userid)).username;

    res.status(200).json({
      ok: true,
      data: { ...likedPost, username },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteLikeFromPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { postId } = req.params;
    const userId = String(req.userId);

    const post = await getPostById(postId);
    if (!post)
      throw new PostableError("Post not found", 404, "Controller Error");

    await dislike(postId, userId);
    const dislikedPost = await updateDislikeInPost(postId);

    let username: String | undefined = undefined;
    if (post.userid) username = (await getUserById(post.userid)).username;

    res.status(200).json({
      ok: true,
      data: { ...dislikedPost, username },
    });
  } catch (error) {
    next(error);
  }
}
