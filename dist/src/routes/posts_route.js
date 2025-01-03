"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_controller_1 = __importDefault(require("../controllers/posts_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
router.post("/", user_controller_auth_1.authMiddleware, (req, res) => {
    posts_controller_1.default.createPost(req, res);
});
router.get("/", (req, res) => {
    posts_controller_1.default.getPosts(req, res);
});
router.get("/:id", (req, res) => {
    posts_controller_1.default.getPostById(req, res);
});
router.put("/:id", (req, res) => {
    posts_controller_1.default.updatedPost(req, res);
});
router.delete("/:id", user_controller_auth_1.authMiddleware, (req, res) => {
    posts_controller_1.default.deleteItem(req, res);
});
exports.default = router;
//# sourceMappingURL=posts_route.js.map