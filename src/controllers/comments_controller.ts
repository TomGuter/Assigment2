import CommentModel from "../models/comments_model";
import PostModel from "../models/posts_model";
import { Request, Response } from "express";

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await CommentModel.find();
    res.status(200).send(comments);
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const createComment = async (req: Request, res: Response) => {
  const { body } = req;
  try {
    console.log("Received Comment Data:", body);
    const post = await PostModel.findById(body.postId);

    if (!post) {
      res.status(400).send("Post not found for the provided ID.");
    } else {
      const newComment = await CommentModel.create(body);
      console.log("Created Comment:", newComment);
      res.status(201).send(newComment);
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const getCommentById = async (req: Request, res: Response) => {
  const filter = req.query.sender;
  try {
    if (filter) {
      const comments = await CommentModel.find({ sender: filter });
      res.send(comments);
    } else {
      const comment = await CommentModel.findById(req.params.id);
      if (comment) {
        res.send(comment);
      } else {
        res.status(404).send("Comment not found");
      }
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const { comment } = req.body;

  if (!comment) {
    res.status(400).send("Problem with comment");
  } else {
    try {
      const updated_comment = await CommentModel.findByIdAndUpdate(
        commentId,
        { comment },
        { new: true, runValidators: true }
      );

      if (updated_comment) {
        res.status(200).send(updated_comment);
      }
    } catch (error) {
      res.status(400).send((error as Error).message);
    }
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await CommentModel.findByIdAndDelete(id);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export default {
  getAllComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
};
