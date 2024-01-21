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
      throw new PostableError("There aren't posts", 404, "Error at service");
    return posts;
  } catch (error) {
    throw error;
  }
}

export async function getPostById(id: string): Promise<Post> {
  try {
    const post = await postDB.getPostById(id);
    if (!post)
      throw new PostableError("Post doesn't exist", 404, "Error at service");
    return post;
  } catch (error) {
    throw error;
  }
}

export async function updatePost(
  data: PostParams,
  postId: string
): Promise<Post> {
  try {
    const post = await postDB.getPostById(postId);
    if (!post)
      throw new PostableError("Post doesn't exist", 404, "Error at service");
    return await postDB.updatePost(data, postId);
  } catch (error) {
    throw error;
  }
}

export async function updateLikeInPost(postId: string): Promise<Post> {
  try {
    const post = await postDB.getPostById(postId);
    if (!post)
      throw new PostableError("Post doesn't exist", 404, "Error at service");
    return await postDB.updateLikeInPost(postId);
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
      throw new PostableError("There aren't posts", 404, "Error at service");
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
