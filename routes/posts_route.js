const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts_controller");


router.post("/", postsController.createPost);

router.get("/", postsController.getPosts);

router.get("/:id", postsController.getPostById);

router.put("/:id", postsController.updatedPost);

module.exports = router;
