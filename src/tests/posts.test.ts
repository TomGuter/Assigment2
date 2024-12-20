import request from "supertest";
import moduleApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;
const valid_post = {
    sender: "test title",
    message: "test content"
};

beforeAll(async () => {
    app = await moduleApp();    
    await postModel.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Posts test suite", () => {
    test("Post test get all posts", async () => {
      const response = await request(app).get("/posts");
      expect(response.status).toBe(200);
        
    });

    test("Add post", async () => {
        const response = await request(app)
            .post("/posts")
            .send(valid_post);
        expect(response.status).toBe(201); 
        expect(response.body.sender).toBe(valid_post.sender);
        expect(response.body.message).toBe(valid_post.message);

    });
    

        


});