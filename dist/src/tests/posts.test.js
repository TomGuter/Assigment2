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
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const userInfo = {
    email: "hodaya@gmail.com",
    password: "123456",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield posts_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
    userInfo.token = response.body.accessToken;
    userInfo._id = response.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
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
    test("Posts Get All test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    }));
    test("Posts Create test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(testPost1);
        console.log(response.body);
        const post = response.body;
        expect(response.statusCode).toBe(201);
        expect(post.sender).toBe(testPost1.sender);
        expect(post.message).toBe(testPost1.message);
        postId = post._id;
    }));
    test("Posts Get By Id test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        const post = response.body;
        console.log("/posts/" + postId);
        console.log(post);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post._id);
    }));
    test("Posts Get By Id test fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId + "3");
        const post = response.body;
        expect(response.statusCode).toBe(400);
    }));
    test("Posts Create test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set("authorization", "JWT " + userInfo.token)
            .send(Object.assign(Object.assign({}, testPost1), { sender: userInfo._id })); // Add sender if needed.
        console.log("Response Body:", response.body);
        const post = response.body;
        expect(response.statusCode).toBe(201);
        expect(post.sender).toBe(userInfo._id);
        expect(post.message).toBe(testPost1.message);
        postId = post._id;
    }));
    test("Posts Create test fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send(testPostFail);
        expect(response.statusCode).not.toBe(201);
    }));
    test("Posts get posts by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?sender=" + userInfo._id);
        const post = response.body[0];
        expect(response.statusCode).toBe(200);
        expect("hodaya").toBe(testPost1.sender);
        expect(response.body.length).toBe(1);
    }));
    test("Posts Delete test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/posts/" + postId)
            .set("authorization", "JWT " + userInfo.token);
        expect(response.statusCode).toBe(200);
        const respponse2 = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(respponse2.statusCode).toBe(400);
        const respponse3 = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        const post = respponse3.body;
        console.log(post);
        expect(respponse3.statusCode).toBe(400);
    }));
});
//# sourceMappingURL=posts.test.js.map