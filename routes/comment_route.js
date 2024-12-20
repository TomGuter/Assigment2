const express = require("express");
const router = express.Router();
const comments_controller = require("../controllers/comments_controller.js");

router.get("/:id", comments_controller.getCommentById);

router.post("/", comments_controller.createComment);

router.put("/:id", comments_controller.updateComment);

router.delete("/:id", comments_controller.deleteComment);


module.exports = router;