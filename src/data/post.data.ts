import { query } from "../db";
import { PostableError } from "../middlewares/error.middleware";
import { Post, PostFilters, PostParams } from "../models/post.model";
import { getDate } from "../utils/getDate";
import { filtering, sorting } from "../utils/postFilters";
import { StringifyObject } from "../utils/stringifyObject.utils";

export async function getPosts(
  filters: PostFilters = {},
  sort?: string[],
  page?: number,
  limit?: number
): Promise<Post[]> {
  try {
    const queryParams: (string | boolean | number)[] = [];

    let myQuery = `SELECT id, content, createdat, updatedat FROM posts`;
    if (filters["posts.userid"])
      myQuery = `SELECT posts.id, posts.content, posts.createdat, 
                        posts.updatedat, users.username, posts.likesCount
                 FROM posts JOIN users ON posts.userid = users.id`;

    // Filtering
    myQuery = filtering(myQuery, filters, queryParams);
    // Sorting
    myQuery = sorting(myQuery, sort);

    // Pagination
    if (page && limit) {
      const offset = (page - 1) * limit;
      myQuery += ` LIMIT ${limit} OFFSET ${offset};`;
    }

    const result = await query(myQuery, queryParams);
    return result.rows;
  } catch (error) {
    throw new PostableError("Couldn't get posts", 403, "Data error", error);
  }
}

export async function getPostById(id: string) {
  try {
    return (await query("SELECT * FROM posts WHERE id = $1", [id])).rows[0];
  } catch (error) {
    throw new PostableError("Couldn't get post", 403, "Data Error", error);
  }
}

export async function updatePost(data: PostParams, postId: string) {
  try {
    data.updatedAt = getDate();
    const stringifyObject = StringifyObject(data);

    return (
      await query(
        `UPDATE posts SET ${stringifyObject} WHERE id = $1
         RETURNING id,content,createdat,updatedat,likesCount;
      `,
        [postId]
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Couldn't update post", 403, "Data error", error);
  }
}

export async function updateLikeInPost(postId: string): Promise<Post> {
  try {
    return (
      await query(
        `UPDATE posts SET likesCount = likesCount + 1, updatedAt = $1 WHERE id = $2
         RETURNING id, content, createdAt, updatedAt, likesCount;`,
        [getDate(), postId]
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Couldn't give like", 403, "Data error", error);
  }
}

export async function updateDislikeInPost(postId: string): Promise<Post> {
  try {
    return (
      await query(
        `UPDATE posts SET likesCount = likesCount - 1, updatedAt = $1 WHERE id = $2
         RETURNING id, content, createdAt, updatedAt, likesCount;`,
        [getDate(), postId]
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Couldn't give like", 403, "Data error", error);
  }
}

export async function getPostsCount(
  filters: PostFilters = {}
): Promise<number> {
  try {
    let myQuery = "SELECT COUNT(*) FROM posts";
    const queryParams: (string | boolean | number)[] = [];
    // Filtering
    myQuery = filtering(myQuery, filters, queryParams);

    const result = await query(myQuery, queryParams);
    return Number(result.rows[0].count);
  } catch (error) {
    throw new PostableError("Couldn't get count", 403, "Data error", error);
  }
}

export async function createPost(
  data: PostParams,
  userId: number
): Promise<Post> {
  try {
    data.userid = userId;
    const keys = Object.keys(data);
    const indices = keys.map((_, index) => `$${index + 1}`).join(",");
    const columns = keys.join(",");
    const values = Object.values(data);

    return (
      await query(
        `INSERT INTO posts(${columns}) VALUES (${indices})
       RETURNING id, content, userId, createdAt, updatedAt, likesCount`,
        values
      )
    ).rows[0];
  } catch (error) {
    throw new PostableError("Couldn't add post", 403, "Data error", error);
  }
}
