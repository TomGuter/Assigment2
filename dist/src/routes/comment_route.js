"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_controller_1 = __importDefault(require("../controllers/comments_controller"));
router.get("/:id", (req, res) => {
    comments_controller_1.default.getCommentById(req, res);
});
router.post("/", (req, res) => {
    comments_controller_1.default.createComment(req, res);
});
router.put("/:id", (req, res) => {
    comments_controller_1.default.updateComment(req, res);
});
router.delete("/:id", (req, res) => {
    comments_controller_1.default.deleteComment(req, res);
});
exports.default = router;
//# sourceMappingURL=comment_route.js.map