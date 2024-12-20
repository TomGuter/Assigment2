import request from "supertest";
import moduleApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import CommentModel from "../models/comments_model";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
    app = await moduleApp();
    await postModel.deleteMany();
    await CommentModel.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Comments test suite", () => {
    test("Add comment", async () => {
        console.log("Add comment test");
    });
});