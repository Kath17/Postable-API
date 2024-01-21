import * as postDB from "../data/post.data";
import { PostableError } from "../middlewares/error.middleware";
import { Post, PostFilters, PostParams } from "../models/post.model";

export async function getPosts(
  filters: PostFilters = {},
  sort?: string[],
  page: number = 1,
  limit: number = 10
): Promise<Post[]> {
  try {
    const posts = await postDB.getPosts(filters, sort, page, limit);
    if (!posts)
      throw new PostableError("There aren't posts", 403, "Error at service");
    return posts;
  } catch (error) {
    throw error;
  }
}

export async function getPostsCount(
  filters: PostFilters = {}
): Promise<number> {
  try {
    const countOfPosts = await postDB.getPostsCount(filters);
    if (!countOfPosts)
      throw new PostableError("There aren't posts", 403, "Error at service");
    return countOfPosts;
  } catch (error) {
    throw error;
  }
}

export async function createPost(data: PostParams, userId: number) {
  try {
    const post = await postDB.createPost(data, userId);
    return post;
  } catch (error) {
    throw error;
  }
}
