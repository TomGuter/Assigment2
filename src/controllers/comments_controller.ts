import CommentModel from "../models/comments_model";
import postModel from "../models/posts_model";
import { Request, Response } from "express";

const getAll = async (req: Request, res: Response) => {
  const filter = { ...req.query };
  try {
    const data = await CommentModel.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const createComment = async (req: Request, res: Response) => {
  const { postId } = req.body;

  try {
    const post = await postModel.findById(postId);

    if (post) {
      const comment = await CommentModel.create(req.body);
      return res.status(202).send(comment);
    } else {
      return res.status(400).send("Post by ID not found");
    }
  } catch (error) {
    return res.status(400).send((error as Error).message);
  }
};

const getCommentById = async (req: Request, res: Response) => {
  const postId = req.params.id;

  if (postId) {
    try {
      const comments = await CommentModel.find({ postId });

      if (comments) {
        return res.send(comments);
      } else {
        return res.status(400).send("comments for this post were not found");
      }
    } catch (error) {
      return res.status(400).send((error as Error).message);
    }
  } else {
    return res.status(400).send("Porblem with Id");
  }
};

const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const { comment } = req.body;

  if (!commentId) {
    return res.status(400).send("Invalid id");
  }
  if (!comment) {
    return res.status(400).send("Problem with comment");
  }

  try {
    const updated_comment = await CommentModel.findByIdAndUpdate(
      commentId,
      { comment },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updated_comment) {
      return res.status(202).send(updated_comment);
    } else {
      return res.status(400).send("Comment not found");
    }
  } catch (error) {
    return res.status(400).send((error as Error).message);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (id) {
    try {
      const post = await CommentModel.findByIdAndDelete(id);
      if (post) {
        return res
          .status(200)
          .send(`Comment with id ${id} deleted successfully.`);
      } else {
        return res.status(200).send("Comment not found");
      }
    } catch (error) {
      return res.status(400).send((error as Error).message);
    }
  } else {
    return res.status(400).send("Invalid id");
  }
};

export default {
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
  getAll,
};
