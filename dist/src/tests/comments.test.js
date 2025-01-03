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
let app;
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield comments_model_1.default.deleteMany();
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
    testComment.sender = testUser._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Comments test suite", () => {
    test("Comment test get all Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Test adding new comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set({ authorization: "JWT " + testUser.token })
            .send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.sender).toBe(testComment.sender);
        expect(response.body.comment).toBe(testComment.comment);
        commentId = response.body._id;
    }));
    test("Test adding invalid comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set({ authorization: "JWT " + testUser.token })
            .send(invalidComment);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get all comments after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Test get comments by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?sender=" + testComment.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].sender).toBe(testComment.sender);
    }));
    test("Test get comments by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    }));
    test("Test get comments by fail id-1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId + "5");
        expect(response.statusCode).toBe(400);
    }));
    test("Test get comments by fail id-2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    }));
    test("Update comments test by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateComments = {
            comment: "Updated comment",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/comments/" + commentId)
            .set({ authorization: "JWT " + testUser.token })
            .send(updateComments);
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(updateComments.comment);
    }));
    test("Comments Delete test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/comments/" + commentId)
            .set({ authorization: "JWT " + testUser.token });
        expect(response.statusCode).toBe(200);
        const respponse2 = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(respponse2.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map