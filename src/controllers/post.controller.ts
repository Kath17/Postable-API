import { NextFunction, Request, Response } from "express";
import { createPost, getPosts, getPostsCount } from "../services/post.service";
import { PostFilters } from "../models/post.model";
import { getUserByUsername } from "../services/user-auth.service";
import { getDate } from "../utils/getDate";
import { PostableError } from "../middlewares/error.middleware";

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

export async function giveLikeToPost(
  req: Request,
  res: Response,
  next: NextFunction
) {}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {}

export async function deleteLikeFromPost(
  req: Request,
  res: Response,
  next: NextFunction
) {}
