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
const user_model_1 = __importDefault(require("../models/user_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.deleteMany();
    yield posts_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const userInfo = {
    email: "hodaya@gmail.com",
    password: "123456",
};
describe("Auth Tests", () => {
    test("Auth Registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).toBe(200);
    }));
    test("Auth Registration fail", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).not.toBe(200);
        console.log("ressssss::::::", response.statusCode);
    }));
    test("Auth Registration fail with exists email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth Registration fail without password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
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
    }));
    test("Auth Login fail with correct password and false email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: userInfo.email + "1", password: userInfo.password });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth Login fail with correct email and false password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: userInfo.email, password: userInfo.password + "1" });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Missing TOKEN_SECRET in login", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Make sure two access tokens are notr the same", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password,
        });
        expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
    }));
    test("Get protected API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            sender: "invalid owner",
            message: "My First post",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "jwt " + userInfo.accessToken,
        })
            .send({
            sender: "invalid owner",
            message: "My First post",
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("Get protected API invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "jwt " + userInfo.accessToken + "1",
        })
            .send({
            sender: userInfo._id,
            message: "This is my first post",
        });
        expect(response.statusCode).not.toBe(201);
    }));
    test("Refresh Token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken;
        userInfo.refreshToken = response.body.refreshToken;
    }));
    test("Logout - invalidate refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({
            refreshToken: userInfo.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken,
        });
        expect(response2.statusCode).not.toBe(200);
    }));
    test("Missing TOKEN_SECRET in logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send(userInfo);
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/refresh")
            .send({ refreshToken: "invalidToken" });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Refresh: Missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh");
        expect(response.statusCode).not.toBe(200);
    }));
    test("Missing TOKEN_SECRET in refresh", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/refresh")
            .send({ refreshToken: userInfo.refreshToken });
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    }));
    jest.setTimeout(10000);
    test("timeout on refresh access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken = response.body.accessToken;
        userInfo.refreshToken = response.body.refreshToken;
        yield new Promise((resolve) => setTimeout(resolve, 6000));
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "jwt " + userInfo.accessToken,
        })
            .send({
            sender: "Hodaya",
            mwssage: "My First post",
        });
        expect(response2.statusCode).not.toBe(201);
        const response3 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken,
        });
        expect(response3.statusCode).toBe(200);
        userInfo.accessToken = response3.body.accessToken;
        userInfo.refreshToken = response3.body.refreshToken;
        const response4 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "jwt " + userInfo.accessToken,
        })
            .send({
            sender: "Tom",
            message: "My First post",
        });
        expect(response4.statusCode).toBe(201);
    }));
});
//# sourceMappingURL=user_auth.test.js.map