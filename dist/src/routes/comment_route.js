"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_controller_1 = __importDefault(require("../controllers/comments_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
router.get("/", (req, res) => {
    comments_controller_1.default.getAll(req, res);
});
router.get("/:id", (req, res) => {
    comments_controller_1.default.getCommentById(req, res);
});
router.post("/", user_controller_auth_1.authMiddleware, (req, res) => {
    comments_controller_1.default.createComment(req, res);
});
router.put("/:id", user_controller_auth_1.authMiddleware, (req, res) => {
    comments_controller_1.default.updateComment(req, res);
});
router.delete("/:id", user_controller_auth_1.authMiddleware, (req, res) => {
    comments_controller_1.default.deleteComment(req, res);
});
exports.default = router;
//# sourceMappingURL=comment_route.js.map