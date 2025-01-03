import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_model";
import userModel from "../models/user_model";
import { Express } from "express";

let app: Express;
let commentId = "";

const testComment = {
  sender: "",
  comment: "Test comment",
  postId: "validPostId",
};

const testUser = {
  email: "test@user.com",
  password: "123456",
  token: "",
  _id: "",
};

const invalidComment = {
  comment: "Missing postId",
};

beforeAll(async () => {
  app = await initApp();
  await commentModel.deleteMany();
  await userModel.deleteMany();

  const registerResponse = await request(app)
    .post("/auth/register")
    .send(testUser);
  expect(registerResponse.statusCode).toBe(200);

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({ email: testUser.email, password: testUser.password });
  expect(loginResponse.statusCode).toBe(200);

  testUser.token = loginResponse.body.accessToken;
  testUser._id = loginResponse.body._id;

  testComment.sender = testUser._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comments test suite", () => {
  test("Comment test get all Comments", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test adding new comments", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send(testComment);
    expect(response.statusCode).toBe(201);
    expect(response.body.sender).toBe(testComment.sender);
    expect(response.body.comment).toBe(testComment.comment);
    commentId = response.body._id;
  });

  test("Test adding invalid comments", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send(invalidComment);
    expect(response.statusCode).toBe(400);
  });

  test("Test get all comments after adding", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test get comments by sender", async () => {
    const response = await request(app).get(
      "/comments?sender=" + testComment.sender
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].sender).toBe(testComment.sender);
  });

  test("Test get comments by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(commentId);
  });

  test("Test get comments by fail id-1", async () => {
    const response = await request(app).get("/comments/" + commentId + "5");
    expect(response.statusCode).toBe(400);
  });

  test("Test get comments by fail id-2", async () => {
    const response = await request(app).get(
      "/comments/6745df242f1b06026b3201f8"
    );
    expect(response.statusCode).toBe(404);
  });

  test("Update comments test by id", async () => {
    const updateComments = {
      comment: "Updated comment",
    };

    const response = await request(app)
      .put("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.token })
      .send(updateComments);

    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(updateComments.comment);
  });

  test("Comments Delete test", async () => {
    const response = await request(app)
      .delete("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.token });

    expect(response.statusCode).toBe(200);

    const respponse2 = await request(app).get("/comments/" + commentId);
    expect(respponse2.statusCode).toBe(404);
  });
});
