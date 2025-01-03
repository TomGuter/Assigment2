"use strict";
// // Tom-Guter-316487230
// // Hodaya-Karo-322579848
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const posts_route_1 = __importDefault(require("./routes/posts_route"));
const comment_route_1 = __importDefault(require("./routes/comment_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
dotenv_1.default.config();
const moduleApp = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.DB_CONNECT) {
        throw new Error("MONGO_URI is not set");
    }
    try {
        yield mongoose_1.default.connect(process.env.DB_CONNECT);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use("/posts", posts_route_1.default);
    app.use("/comments", comment_route_1.default);
    app.use("/auth", user_route_1.default);
    return app;
});
exports.default = moduleApp;
//# sourceMappingURL=server.js.map