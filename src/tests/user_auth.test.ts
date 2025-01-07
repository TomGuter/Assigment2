import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postsModel from "../models/posts_model";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postsModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

type UserInfo = {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};
const userInfo: UserInfo = {
  email: "tom@gmail.com",
  password: "123456",
};

describe("Auth Tests", () => {
  test("Auth Registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).toBe(200);
  });

  test("Auth Registration fail", async () => {
    
    await request(app).post("/auth/register").send(userInfo);
  
    
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).not.toBe(200);
    console.log("ressssss::::::", response.statusCode);
  });

  test("Auth Login", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    const userId = response.body._id;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(userId).toBeDefined();
    userInfo.accessToken = accessToken;
    userInfo.refreshToken = refreshToken;
    userInfo._id = userId;
  });

  test("Make sure two access tokens are notr the same", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
  });

  test("Get protected API", async () => {
    const response = await request(app).post("/posts").send({
      sender: "invalid owner",
      message: "My First post",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        sender: "invalid owner",
        message: "My First post",
      });
    expect(response2.statusCode).toBe(201);
  });

  test("Get protected API invalid token", async () => {
    const response = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + userInfo.accessToken + "1",
      })
      .send({
        sender: userInfo._id,
        message: "This is my first post",
      });
    expect(response.statusCode).not.toBe(201);
  });

  test("Refresh Token", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  });

  test("Logout - invalidate refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.statusCode).toBe(200);

    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Refresh token multiuple usage", async () => {
    
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;

    
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.statusCode).toBe(200);
    const newRefreshToken = response2.body.refreshToken;

    
    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);

    
    const response4 = await request(app).post("/auth/refresh").send({
      refreshToken: newRefreshToken,
    });
    expect(response4.statusCode).not.toBe(200);
  });

  jest.setTimeout(10000);
  test("timeout on refresh access token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;

    
    await new Promise((resolve) => setTimeout(resolve, 6000));

    
    const response2 = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        sender: "Tom",
        mwssage: "My First post",
      });
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.statusCode).toBe(200);
    userInfo.accessToken = response3.body.accessToken;
    userInfo.refreshToken = response3.body.refreshToken;

    const response4 = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        sender: "Tom",
        message: "My First post",
      });
    expect(response4.statusCode).toBe(201);
  });
});
