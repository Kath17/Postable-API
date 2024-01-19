import { describe, it, expect } from "vitest";
import request from "supertest";

const testUsers = [
  {
    username: "die17",
    email: "die@gmail.com",
    firstName: "Diego",
    lastName: "Torres",
    role: "user",
  },
  {
    username: "jos18",
    email: "jos@gmail.com",
    firstName: "Jose",
    lastName: "Luis",
    role: "user",
  },
];

describe("Users API", () => {
  it("Test", () => {
    expect(true).toBe(true);
  });
});
