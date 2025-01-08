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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
let app;
let commentId = "";
const testUser = {
    email: "test@user.com",
    password: "123456",
    token: "",
    _id: "",
};
const testPost = {
    sender: "Tom",
    message: "Test content",
};
const testComment = {
    sender: "Tom",
    comment: "Test comment",
    postId: "",
    commentId: "",
};
const invalidComment = {
    comment: "Missing postId",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield comments_model_1.default.deleteMany();
    yield posts_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    const registerResponse = yield (0, supertest_1.default)(app)
        .post("/auth/register")
        .send(testUser);
    expect(registerResponse.statusCode).toBe(200);
    const loginResponse = yield (0, supertest_1.default)(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
    expect(loginResponse.statusCode).toBe(200);
    testUser.token = loginResponse.body.accessToken;
    testUser._id = loginResponse.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Comments Test Suite", () => {
    test("Should add a new post successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", `JWT ${testUser.token}`)
            .send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.sender).toBe(testPost.sender);
        expect(response.body.message).toBe(testPost.message);
        testComment.postId = response.body._id;
    }));
    test("Should get all comments (none exist initially)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Should add a new comment successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set("authorization", `JWT ${testUser.token}`)
            .send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.sender).toBe(testComment.sender);
        expect(response.body.comment).toBe(testComment.comment);
        commentId = response.body._id;
    }));
    test("Should handle errors when creating a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(posts_model_1.default, "findById").mockImplementationOnce(() => {
            throw new Error("Database connection error");
        });
        const response = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set("authorization", `JWT ${testUser.token}`)
            .send(testComment);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Database connection error");
        jest.restoreAllMocks();
    }));
    test("Should fail to add an invalid comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set("authorization", `JWT ${testUser.token}`)
            .send(invalidComment);
        expect(response.statusCode).toBe(400);
    }));
    test("Should get all comments after adding one", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Should get comments by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comments?sender=${testComment.sender}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].sender).toBe(testComment.sender);
    }));
    test("Should get a comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/comments/${commentId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    }));
    test("Should handle errors when querying comments with a sender filter", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidSender = "nonexistentSender";
        jest.spyOn(comments_model_1.default, "find").mockRejectedValueOnce(new Error("Database connection error"));
        const response = yield (0, supertest_1.default)(app)
            .get(`/comments?sender=${invalidSender}`)
            .set("authorization", `JWT ${testUser.token}`);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Database connection error");
        jest.restoreAllMocks();
    }));
    test("Should fail to get a comment by invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidIdResponse = yield (0, supertest_1.default)(app).get(`/comments/${commentId}5`);
        expect(invalidIdResponse.statusCode).toBe(400);
        const nonExistentIdResponse = yield (0, supertest_1.default)(app).get("/comments/6745df242f1b06026b3201f8");
        expect(nonExistentIdResponse.statusCode).toBe(404);
    }));
    test("Should return error for missing comment content", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/comments/${commentId}`)
            .set("authorization", `JWT ${testUser.token}`)
            .send({});
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Problem with comment");
    }));
    test("Should update the comment successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedComment = "Updated comment content";
        const response = yield (0, supertest_1.default)(app)
            .put(`/comments/${commentId}`)
            .set("authorization", `JWT ${testUser.token}`)
            .send({ comment: updatedComment });
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(updatedComment);
        expect(response.body._id).toBe(commentId);
    }));
    test("Should return error when update fails due to DB issue", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(comments_model_1.default, "findByIdAndUpdate").mockRejectedValueOnce(new Error("Database update error"));
        const response = yield (0, supertest_1.default)(app)
            .put(`/comments/${commentId}`)
            .set("authorization", `JWT ${testUser.token}`)
            .send({ comment: "Updated comment content" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Database update error");
        jest.restoreAllMocks();
    }));
    test("Should handle database error when deleting comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = "invalid-id-format";
        const response = yield (0, supertest_1.default)(app)
            .delete(`/comments/${invalidId}`)
            .set("authorization", `JWT ${testUser.token}`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    }));
});
//# sourceMappingURL=comments.test.js.map