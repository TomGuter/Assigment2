import express from "express";
const router = express.Router();
import comments_controller from "../controllers/comments_controller";

router.get("/:id", (req, res) => {
    comments_controller.getCommentById(req, res)});

router.post("/", (req, res) => {
    comments_controller.createComment(req, res)});

router.put("/:id", (req, res) => {
    comments_controller.updateComment(req, res)});

router.delete("/:id", (req, res) => {
    comments_controller.deleteComment(req, res)});


export default router;