"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    sender: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
    },
});
const CommentModel = mongoose_1.default.model("Comment", CommentSchema);
exports.default = CommentModel;
//# sourceMappingURL=comments_model.js.map