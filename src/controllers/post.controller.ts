import { NextFunction, Request, Response } from "express";
import {
  createPost,
  getPostById,
  getPosts,
  getPostsCount,
  updatePost,
} from "../services/post.service";
import { Post, PostFilters } from "../models/post.model";
import { getUserByUsername } from "../services/user-auth.service";
import { getDate } from "../utils/getDate";
import { PostableError } from "../middlewares/error.middleware";
import { getUserById } from "../services/user.service";

export async function getPostsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId: string | undefined = undefined;
    if (req.query["username"]) {
      userId = (
        await getUserByUsername(req.query["username"] as string)
      ).id.toString();
    }
    const filters: PostFilters = {
      "posts.userId": userId,
    };
    const page = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const orderBy = req.query["orderBy"] || "createdat";
    const order = req.query["order"] || "ASC";
    const sort = [orderBy.toString(), order.toString()];

    const posts = await getPosts(filters, sort, page, limit);

    // Pagination
    const totalItems = await getPostsCount(filters);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      ok: true,
      data: posts,
      pagination: {
        page,
        pageSize: limit,
        totalItems,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPostsByUsernameController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = req.params;
    const userId = (await getUserByUsername(username)).id;

    if (!userId)
      throw new PostableError("User doesn't exist", 403, "Error at service");

    let filters: PostFilters = {
      "posts.userId": userId.toString(),
    };

    const page = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const orderBy = req.query["orderBy"] || "createdat";
    const order = req.query["order"] || "ASC";
    const sort = [orderBy.toString(), order.toString()];

    const posts = await getPosts(filters, sort, page, limit);

    //Pagination
    const totalItems = await getPostsCount(filters);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      ok: true,
      data: posts,
      pagination: {
        page,
        pageSize: limit,
        totalItems,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId as number;
    let newPost = req.body;
    let currentDate = getDate();

    newPost.createdAt = currentDate;
    newPost.updatedAt = currentDate;
    const post = await createPost(newPost, userId);
    res.status(201).json({ ok: true, data: post });
  } catch (error) {
    next(error);
  }
}

export async function updatePostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId as number;
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post)
      throw new PostableError("Post doesn't exist", 404, "Error at controller");
    else {
      if (userId !== post.userid)
        throw new PostableError("Not authorized", 401, "Error at controller");

      const postBody = req.body;
      if (Object.entries(postBody).length === 0)
        throw new PostableError("There's no body", 400, "Error at controller");

      const updatedPost: Post = await updatePost(postBody, id);
      const username = (await getUserById(post.userid)).username;
      res
        .status(200)
        .json({ ok: true, data: { ...updatedPost, username: username } });
    }
  } catch (error) {
    next(error);
  }
}
