"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_controller_1 = __importDefault(require("../controllers/posts_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - sender
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         sender:
 *           type: string
 *           description: The sender of the post
 *         message:
 *           type: string
 *           description: The message of the post
 *         owner:
 *           type: string
 *           description: The owner id of the post
 *       example:
 *         _id: 60d0fe4f531123fs168as09ca
 *         sender: Tom
 *         message: This is the content of my first post.
 *         author: 60d0fe4f5311236168a109ca
 */
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 description: The id of the sender
 *               message:
 *                 type: string
 *                 description: The message of the post
 *             required:
 *               - sender
 *               - message
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", user_controller_auth_1.authMiddleware, (req, res) => {
    posts_controller_1.default.createPost(req, res);
});
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get("/", (req, res) => {
    posts_controller_1.default.getPosts(req, res);
});
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a single post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/:id", (req, res) => {
    posts_controller_1.default.getPostById(req, res);
});
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     description: Update a single post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 description: The id of the sender
 *               message:
 *                 type: string
 *                 description: The message of the post
 *             required:
 *               - sender
 *               - message
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put("/:id", user_controller_auth_1.authMiddleware, (req, res) => {
    posts_controller_1.default.updatePost(req, res);
});
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Delete a single post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", user_controller_auth_1.authMiddleware, (req, res) => {
    posts_controller_1.default.deletePost(req, res);
});
exports.default = router;
//# sourceMappingURL=posts_route.js.map