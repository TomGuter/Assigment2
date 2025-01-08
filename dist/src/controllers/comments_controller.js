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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comments_model_1.default.find();
        res.status(200).send(comments);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        console.log("Received Comment Data:", body);
        const post = yield posts_model_1.default.findById(body.postId);
        if (!post) {
            res.status(400).send("Post not found for the provided ID.");
        }
        else {
            const newComment = yield comments_model_1.default.create(body);
            console.log("Created Comment:", newComment);
            res.status(201).send(newComment);
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.sender;
    try {
        if (filter) {
            const comments = yield comments_model_1.default.find({ sender: filter });
            res.send(comments);
        }
        else {
            const comment = yield comments_model_1.default.findById(req.params.id);
            if (comment) {
                res.send(comment);
            }
            else {
                res.status(404).send("Comment not found");
            }
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const { comment } = req.body;
    if (!comment) {
        res.status(400).send("Problem with comment");
    }
    else {
        try {
            const updated_comment = yield comments_model_1.default.findByIdAndUpdate(commentId, { comment }, { new: true, runValidators: true });
            if (updated_comment) {
                res.status(200).send(updated_comment);
            }
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield comments_model_1.default.findByIdAndDelete(id);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = {
    getAllComments,
    createComment,
    getCommentById,
    updateComment,
    deleteComment,
};
//# sourceMappingURL=comments_controller.js.map