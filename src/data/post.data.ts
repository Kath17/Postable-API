import { query } from "../db";
import { PostableError } from "../middlewares/error.middleware";
import { Post, PostFilters, PostParams } from "../models/post.model";
import { filtering, sorting } from "../utils/postFilters";

export async function getPosts(
  filters: PostFilters = {},
  sort?: string[],
  page?: number,
  limit?: number
): Promise<Post[]> {
  try {
    const queryParams: (string | boolean | number)[] = [];

    let myQuery = `SELECT id, content, createdat, updatedat FROM posts`;
    if (filters["posts.userId"])
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
    console.log("myQuery: ", myQuery);
    console.log("queryParams: ", queryParams);

    const result = await query(myQuery, queryParams);
    return result.rows;
  } catch (error) {
    throw new PostableError("Couldn't get posts", 403, "Data error", error);
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
    data.userId = userId;
    const keys = Object.keys(data);
    const indices = keys.map((_, index) => `$${index + 1}`).join(",");
    const columns = keys.join(",");
    const values = Object.values(data);

    console.log(" -> ", data);

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
