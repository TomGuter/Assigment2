import express from "express";
const router = express.Router();
import comments_controller from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/user_controller_auth";

router.get("/", (req, res) => {
  comments_controller.getAll(req, res);
});

router.get("/:id", (req, res) => {
  comments_controller.getCommentById(req, res);
});

router.post("/", authMiddleware, (req, res) => {
  comments_controller.createComment(req, res);
});

router.put("/:id", authMiddleware, (req, res) => {
  comments_controller.updateComment(req, res);
});

router.delete("/:id", authMiddleware, (req, res) => {
  comments_controller.deleteComment(req, res);
});

export default router;
