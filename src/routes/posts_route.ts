import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";

router.post("/", (req, res) => {
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

export default router;
