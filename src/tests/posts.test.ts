import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;
let accessToken: string;
let postId = "";

const testUser = {
  email: "test@user.com",
  password: "123456",
};

const testPost = {
  sender: "user_id",
  message: "Test content",
};

const invalidPost = {
  content: "Test content",
};


beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();

  await request(app).post("/auth/register").send(testUser);
  const loginResponse = await request(app).post("/auth/login").send(testUser);
  expect(loginResponse.statusCode).toBe(200);

  accessToken = loginResponse.body.accessToken;
  testPost.sender = loginResponse.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Posts API Test Suite", () => {
  describe("GET /posts", () => {
    test("Should return an empty list of posts initially", async () => {
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("POST /posts", () => {
    test("Should add a new post successfully", async () => {
      const response = await request(app)
        .post("/posts")
        .set("authorization", `JWT ${accessToken}`)
        .send(testPost);

      expect(response.statusCode).toBe(201);
      expect(response.body.sender).toBe(testPost.sender);
      expect(response.body.message).toBe(testPost.message);

      postId = response.body._id;
    });

    test("Should fail to add an invalid post", async () => {
      const response = await request(app)
        .post("/posts")
        .set("authorization", `JWT ${accessToken}`)
        .send(invalidPost);

      expect(response.statusCode).not.toBe(201);
    });
  });

  describe("GET /posts after adding a post", () => {
    test("Should return a list with one post", async () => {
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    test("Should get post by sender", async () => {
      const response = await request(app).get(`/posts?sender=${testPost.sender}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].sender).toBe(testPost.sender);
    });

    test("Should get post by ID", async () => {
      const response = await request(app).get(`/posts/${postId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBe(postId);
    });

    test("Should fail to get a non-existent post by ID", async () => {
      const response = await request(app).get("/posts/67447b032ce3164be7c4412d");
      expect(response.statusCode).toBe(400);
    });
  });

    test("Should update a post by ID", async () => {
    const updatedPost = { sender: "Hodaya", message: "This is an updated test post" };
  
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set("authorization", `JWT ${accessToken}`)
      .send(updatedPost);
  
    expect(response.statusCode).toBe(200);
    expect(response.body.sender).toBe(updatedPost.sender);
    expect(response.body.message).toBe(updatedPost.message);
  });

    test("Should fail to update a post with invalid ID", async () => {
    const updatedPost = { sender: "Hodaya", message: "This is an updated test post" };
    const invalidPostId = "6777b39a4c79d92f497af3eb";
  
    const response = await request(app)
      .put(`/posts/${invalidPostId}`)
      .set("authorization", `JWT ${accessToken}`)
      .send(updatedPost);
  
    expect(response.statusCode).not.toBe(200);
  });

    describe("DELETE /posts/:id", () => {
    test("Should delete a post successfully", async () => {
      const deleteResponse = await request(app)
        .delete(`/posts/${postId}`)
        .set("authorization", `JWT ${accessToken}`);
      expect(deleteResponse.statusCode).toBe(200);
  
      const getResponse = await request(app).get(`/posts/${postId}`);
      expect(getResponse.statusCode).toBe(400);
    });
  
    test("Should fail to delete a post with invalid ID", async () => {
      const invalidPostId = "invalidPostId";
  
      const deleteResponse = await request(app)
        .delete(`/posts/${invalidPostId}`)
        .set("authorization", `JWT ${accessToken}`);
      expect(deleteResponse.statusCode).not.toBe(200);
    });
  });

  
});


