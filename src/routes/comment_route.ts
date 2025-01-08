import express from "express";
const router = express.Router();
import comments_controller from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/user_controller_auth";


/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/



/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - sender
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         sender:
 *           type: string
 *           description: The sender of the comment
 *         comment:
 *           type: string
 *           description: The content of the comment
 *         postId:
 *           type: string
 *           description: The ID of the post
 *       example:
 *         _id: 60d0fe4f531123fs168as09cb
 *         sender: Jane
 *         comment: This is a comment on the post.
 *         postId: 60d0fe4f531123fs168as09ca
 */


/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve a list of all comments
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 */
router.get("/", (req, res) => {
  comments_controller.getAllComments(req, res);
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieve a single comment by its ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: A single comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.get("/:id", (req, res) => {
  comments_controller.getCommentById(req, res);
});

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment
 *     tags:
 *       - Comments
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
 *               comment:
 *                 type: string
 *                 description: The content of the comment
 *               postId:
 *                 type: string
 *                 description: The ID of the post
 *             required:
 *               - sender
 *               - comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, (req, res) => {
  comments_controller.createComment(req, res);
});

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     description: Update a single comment by its ID
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
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
 *               comment:
 *                 type: string
 *                 description: The content of the comment
 *               postId:
 *                 type: string
 *                 description: The ID of the post
 *             required:
 *               - sender
 *               - comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, (req, res) => {
  comments_controller.updateComment(req, res);
});

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Delete a single comment by its ID
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, (req, res) => {
  comments_controller.deleteComment(req, res);
});

export default router;
