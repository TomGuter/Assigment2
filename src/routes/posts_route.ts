import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/user_controller_auth";

router.post("/", authMiddleware, (req, res) => {
  postsController.createPost(req, res);
});

router.get("/", (req, res) => {
  postsController.getPosts(req, res);
});

router.get("/:id", (req, res) => {
  postsController.getPostById(req, res);
});

router.put("/:id", (req, res) => {
  postsController.updatedPost(req, res);
});
router.delete("/:id", authMiddleware, (req, res) => {
  postsController.deleteItem(req, res);
});

export default router;
