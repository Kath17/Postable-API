import { describe, beforeEach, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";
import { truncateTable } from "../utils/truncatable";
import * as db from "../db";

const testUsers = [
  {
    username: "diego19",
    email: "diego@gmail.com",
    password: "123456",
    firstName: "Diego",
    lastName: "Torres",
  },
  {
    username: "jose18",
    email: "jos@gmail.com",
    password: "123456",
    firstName: "Jose",
    lastName: "Luis",
  },
];

const loginBody = {
  username: "diego19",
  password: "123456",
};

const unauthorizedEditor = {
  username: "jose18",
  password: "123456",
};

let userToken: string = "";

describe("Users Authentication Router:", () => {
  beforeEach(async () => {
    await truncateTable("users");
  });

  it("Should SIGN UP", async () => {
    const response = await request(app).post("/signup").send(testUsers[0]);
    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("createdat");
    expect(response.body.data).toHaveProperty("updatedat");
  });

  it("Should LOG IN", async () => {
    await request(app).post("/signup").send(testUsers[0]);
    const response = await request(app).post("/login").send(loginBody);
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveProperty("token");
  });
});

describe(`User Profile Router "/me":`, () => {
  beforeEach(async () => {
    await truncateTable("users");
    await truncateTable("posts");
    const newuser = await request(app).post("/signup").send(testUsers[0]);
    console.log("newuser: ", newuser.body.data);
    const response = await request(app).post("/login").send(loginBody);

    userToken = response.body.data["token"];
  });

  it("Should get own profile", async () => {
    const response = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${userToken}`);

    console.log("user_: ", response.body.data);
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.username).toBe(loginBody.username);
    expect(response.body.data.email).toBe(testUsers[0].email);
    expect(response.body.data.firstname).toBe(testUsers[0].firstName);
    expect(response.body.data.lastname).toBe(testUsers[0].lastName);
  });

  it("Should update profile", async () => {
    const updatedInfo = {
      email: "user@gmail.com",
      firstName: "FirstName Edit",
      lastName: "LastName Edit",
    };
    const response = await request(app)
      .patch("/me")
      .set("Authorization", `Bearer ${userToken}`)
      .send(updatedInfo);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.username).toBe(loginBody.username);
    expect(response.body.data.email).toBe(updatedInfo.email);
    expect(response.body.data.firstname).toBe(updatedInfo.firstName);
    expect(response.body.data.lastname).toBe(updatedInfo.lastName);
  });

  it("Should delete profile", async () => {
    const response = await request(app)
      .delete("/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
  });
});

describe("Post Router:", () => {
  beforeEach(async () => {
    await truncateTable("users");
    await truncateTable("posts");
    await request(app).post("/signup").send(testUsers[0]);
    const response = await request(app).post("/login").send(loginBody);

    userToken = response.body.data["token"];
  });

  describe("Endpoint /posts:", () => {
    const postBody = { content: "Post Test Content" };

    it("Should create a post", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${userToken}`)
        .send(postBody);
      expect(response.statusCode).toBe(201);
      expect(response.body.ok).toBeTruthy();
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.content).toBe(postBody.content);
    });

    it("Should edit post", async () => {
      const createdPost = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${userToken}`)
        .send(postBody);
      const postId = createdPost.body.data.id;

      const updatedBody = { content: "New Test Content - Edit" };
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedBody);
      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBeTruthy();
      expect(response.body.data.id).toBe(postId);
      expect(response.body.data.content).toBe(updatedBody.content);
    });

    it("Other user shouldn't edit post", async () => {
      const createdPost = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${userToken}`)
        .send(postBody);
      const postId = createdPost.body.data.id;

      await request(app).post("/signup").send(testUsers[1]);
      const otherUser = await request(app)
        .post("/login")
        .send(unauthorizedEditor);
      userToken = otherUser.body.data["token"];

      const updatedBody = { content: "New Test Content - Edit" };
      const response = await request(app)
        .patch(`/posts/${postId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedBody);
      expect(response.statusCode).toBe(401);
      expect(response.body.ok).toBeFalsy();
      expect(response.body.message).toEqual("Not authorized");
    });
  });

  describe(`Endpoint "/" GET posts:`, () => {
    const firstPostBody = { content: "1 First Post Test Content" };
    const secondPostBody = { content: "2 Second Post Test Content" };
    beforeEach(async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${userToken}`)
        .send(firstPostBody);
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${userToken}`)
        .send(secondPostBody);
    });

    it("Should get every post", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBeTruthy();
      expect(response.body.data).toHaveLength(2);
    });
    it("Should get post using filters, sorting and pagination ", async () => {
      const response = await request(app).get(
        `/?page=1&username=${loginBody.username}&limit=5&orderBy=content&order=DESC`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBeTruthy();
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].content).toEqual(secondPostBody.content);
      expect(response.body.data[1].content).toEqual(firstPostBody.content);
    });
    it("Should get posts of specified user using filters ", async () => {
      const response = await request(app).get(
        `/${loginBody.username}?page=1&limit=5&orderBy=content&order=DESC`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBeTruthy();
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].content).toEqual(secondPostBody.content);
      expect(response.body.data[1].content).toEqual(firstPostBody.content);
    });
  });
});

describe("Like Router:", () => {
  let newPostID: string;
  beforeEach(async () => {
    await truncateTable("users");
    await truncateTable("posts");
    await truncateTable("likes");
    await request(app).post("/signup").send(testUsers[0]);
    const response = await request(app).post("/login").send(loginBody);

    userToken = response.body.data["token"];

    const postBody = { content: "1 First Post Test Content" };
    const newPost = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send(postBody);
    newPostID = newPost.body.data.id;
  });

  it("Should like post", async () => {
    const response = await request(app)
      .post(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data.id).toBe(1);
    expect(response.body.data.likescount).toBe(1);
  });

  it("Shouldn't allow double like in post", async () => {
    const firstLike = await request(app)
      .post(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);
    const secondLike = await request(app)
      .post(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(firstLike.statusCode).toBe(200);
    expect(firstLike.body.data.likescount).toBe(1);

    expect(secondLike.statusCode).toBe(403);
    expect(secondLike.body.ok).toBeFalsy();
    expect(secondLike.body.message).toEqual("Post already liked");
  });

  it("Should dislike post", async () => {
    await request(app)
      .post(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);
    const response = await request(app)
      .delete(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data.id).toBe(1);
    expect(response.body.data.likescount).toBe(0);
  });

  it("Shouldn't allow double dislike in post", async () => {
    await request(app)
      .post(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);
    const firstDislike = await request(app)
      .delete(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);
    const secondDislike = await request(app)
      .delete(`/posts/${newPostID}/like`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(firstDislike.statusCode).toBe(200);
    expect(firstDislike.body.data.likescount).toBe(0);

    expect(secondDislike.statusCode).toBe(403);
    expect(secondDislike.body.ok).toBeFalsy();
    expect(secondDislike.body.message).toEqual("Post had no like");
  });
});

describe("Users Router:", () => {
  beforeEach(async () => {
    await truncateTable("users");
    const values = testUsers
      .map(
        (user) =>
          `('${user.username}', '${user.email}', '${user.password}', '${user.firstName}', 
            '${user.lastName}', 'user', '20-10-01 12:12:00-87', '20-10-01 12:12:00-87')`
      )
      .join(", ");

    let query = `INSERT INTO users (username, email, password, 
                 firstName, lastName, role, createdat, updatedat) 
    VALUES ${values}`;
    await db.query(query);
  });

  it("Should get all users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveLength(2);
  });
});
