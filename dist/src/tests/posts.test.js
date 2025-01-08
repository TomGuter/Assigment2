"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
let app;
let accessToken;
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield posts_model_1.default.deleteMany();
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const loginResponse = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    expect(loginResponse.statusCode).toBe(200);
    accessToken = loginResponse.body.accessToken;
    testPost.sender = loginResponse.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Posts API Test Suite", () => {
    describe("GET /posts", () => {
        test("Should return an empty list of posts initially", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(0);
        }));
    });
    describe("POST /posts", () => {
        test("Should add a new post successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post("/posts")
                .set("authorization", `JWT ${accessToken}`)
                .send(testPost);
            expect(response.statusCode).toBe(201);
            expect(response.body.sender).toBe(testPost.sender);
            expect(response.body.message).toBe(testPost.message);
            postId = response.body._id;
        }));
        test("Should fail to add an invalid post", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post("/posts")
                .set("authorization", `JWT ${accessToken}`)
                .send(invalidPost);
            expect(response.statusCode).not.toBe(201);
        }));
    });
    describe("GET /posts after adding a post", () => {
        test("Should return a list with one post", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        }));
        test("Should get post by sender", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get(`/posts?sender=${testPost.sender}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].sender).toBe(testPost.sender);
        }));
        test("Should get post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get(`/posts/${postId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body._id).toBe(postId);
        }));
        test("Should fail to get a non-existent post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts/67447b032ce3164be7c4412d");
            expect(response.statusCode).toBe(400);
        }));
    });
    test("Should update a post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPost = { sender: "Hodaya", message: "This is an updated test post" };
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/${postId}`)
            .set("authorization", `JWT ${accessToken}`)
            .send(updatedPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.sender).toBe(updatedPost.sender);
        expect(response.body.message).toBe(updatedPost.message);
    }));
    test("Should fail to update a post with invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPost = { sender: "Hodaya", message: "This is an updated test post" };
        const invalidPostId = "6777b39a4c79d92f497af3eb";
        const response = yield (0, supertest_1.default)(app)
            .put(`/posts/${invalidPostId}`)
            .set("authorization", `JWT ${accessToken}`)
            .send(updatedPost);
        expect(response.statusCode).not.toBe(200);
    }));
    describe("DELETE /posts/:id", () => {
        test("Should delete a post successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const deleteResponse = yield (0, supertest_1.default)(app)
                .delete(`/posts/${postId}`)
                .set("authorization", `JWT ${accessToken}`);
            expect(deleteResponse.statusCode).toBe(200);
            const getResponse = yield (0, supertest_1.default)(app).get(`/posts/${postId}`);
            expect(getResponse.statusCode).toBe(400);
        }));
        test("Should fail to delete a post with invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidPostId = "invalidPostId";
            const deleteResponse = yield (0, supertest_1.default)(app)
                .delete(`/posts/${invalidPostId}`)
                .set("authorization", `JWT ${accessToken}`);
            expect(deleteResponse.statusCode).not.toBe(200);
        }));
    });
});
//# sourceMappingURL=posts.test.js.map