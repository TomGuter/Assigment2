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
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = Object.assign({}, req.query);
    try {
        const data = yield comments_model_1.default.find();
        res.status(200).send(data);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    try {
        const post = yield posts_model_1.default.findById(postId);
        if (post) {
            const comment = yield comments_model_1.default.create(req.body);
            return res.status(202).send(comment);
        }
        else {
            return res.status(400).send("Post by ID not found");
        }
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    if (postId) {
        try {
            const comments = yield comments_model_1.default.find({ postId });
            if (comments) {
                return res.send(comments);
            }
            else {
                return res.status(400).send("comments for this post were not found");
            }
        }
        catch (error) {
            return res.status(400).send(error.message);
        }
    }
    else {
        return res.status(400).send("Porblem with Id");
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const { comment } = req.body;
    if (!commentId) {
        return res.status(400).send("Invalid id");
    }
    if (!comment) {
        return res.status(400).send("Problem with comment");
    }
    try {
        const updated_comment = yield comments_model_1.default.findByIdAndUpdate(commentId, { comment }, {
            new: true,
            runValidators: true,
        });
        if (updated_comment) {
            return res.status(202).send(updated_comment);
        }
        else {
            return res.status(400).send("Comment not found");
        }
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id) {
        try {
            const post = yield comments_model_1.default.findByIdAndDelete(id);
            if (post) {
                return res
                    .status(200)
                    .send(`Comment with id ${id} deleted successfully.`);
            }
            else {
                return res.status(200).send("Comment not found");
            }
        }
        catch (error) {
            return res.status(400).send(error.message);
        }
    }
    else {
        return res.status(400).send("Invalid id");
    }
});
exports.default = {
    createComment,
    getCommentById,
    updateComment,
    deleteComment,
    getAll,
};
//# sourceMappingURL=comments_controller.js.map