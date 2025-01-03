import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postsModel from "../models/posts_model";
import { Express } from "express";
import userModel from "../models/user_model";

let app: Express;

type UserInfo = {
  email: string;
  password: string;
  token?: string;
  _id?: string;
};
const userInfo: UserInfo = {
  email: "hodaya@gmail.com",
  password: "123456",
};

beforeAll(async () => {
  app = await initApp();
  await postsModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo.token = response.body.accessToken;
  userInfo._id = response.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

var postId = "";

const testPost1 = {
  sender: "hodaya",
  message: "Test Message",
};

const testPost2 = {
  sender: "Eliav2",
  message: "This is my first post 2",
};

const testPostFail = {
  message: "This is my first post 2",
  sender: "Eliav2",
};

describe("Posts Tests", () => {
  test("Posts Get All test", async () => {
    const response = await request(app).get("/posts");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  test("Posts Create test", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send(testPost1);
    console.log(response.body);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.sender).toBe(testPost1.sender);
    expect(post.message).toBe(testPost1.message);
    postId = post._id;
  });

  test("Posts Get By Id test", async () => {
    const response = await request(app).get("/posts/" + postId);
    const post = response.body;
    console.log("/posts/" + postId);
    console.log(post);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(post._id);
  });

  test("Posts Get By Id test fail", async () => {
    const response = await request(app).get("/posts/" + postId + "3");
    const post = response.body;
    expect(response.statusCode).toBe(400);
  });

  test("Posts Create test", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send({ ...testPost1, sender: userInfo._id }); // Add sender if needed.

    console.log("Response Body:", response.body);
    const post = response.body;

    expect(response.statusCode).toBe(201);
    expect(post.sender).toBe(userInfo._id);
    expect(post.message).toBe(testPost1.message);
    postId = post._id;
  });

  test("Posts Create test fail", async () => {
    const response = await request(app).post("/posts").send(testPostFail);
    expect(response.statusCode).not.toBe(201);
  });

  test("Posts get posts by sender", async () => {
    const response = await request(app).get("/posts?sender=" + userInfo._id);
    const post = response.body[0];
    expect(response.statusCode).toBe(200);
    expect("hodaya").toBe(testPost1.sender);
    expect(response.body.length).toBe(1);
  });

  test("Posts Delete test", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(200);

    const respponse2 = await request(app).get("/posts/" + postId);
    expect(respponse2.statusCode).toBe(400);

    const respponse3 = await request(app).get("/posts/" + postId);
    const post = respponse3.body;
    console.log(post);
    expect(respponse3.statusCode).toBe(400);
  });
});
