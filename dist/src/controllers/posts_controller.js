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
const posts_model_1 = __importDefault(require("../models/posts_model"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postBody = req.body;
    try {
        const post = yield posts_model_1.default.create(postBody);
        res.status(201).send(post);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.sender;
    try {
        if (filter) {
            const posts = yield posts_model_1.default.find({ sender: filter });
            res.send(posts);
        }
        else {
            const posts = yield posts_model_1.default.find();
            res.send(posts);
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield posts_model_1.default.findById(id);
        if (post) {
            res.send(post);
        }
        else {
            res.status(400).send("Post not found");
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const getPostBySender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query;
    console.log(filter);
    try {
        if (filter.sender) {
            const post = yield posts_model_1.default.find({ sender: filter.sender });
            res.send(post);
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const updatedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { sender, message } = req.body;
    if (!id) {
        return res.status(400).send("Post ID is required");
    }
    try {
        const updatedPost = yield posts_model_1.default.findByIdAndUpdate(id, { sender, message });
        if (updatedPost) {
            updatedPost.sender = sender;
            updatedPost.message = message;
            yield updatedPost.save();
            res.send(updatedPost);
        }
        else {
            res.status(400).send("Post not found");
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
exports.default = {
    createPost,
    getPosts,
    getPostById,
    getPostBySender,
    updatedPost,
};
//# sourceMappingURL=posts_controller.js.map