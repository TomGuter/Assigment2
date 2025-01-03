import postModel from "../models/posts_model";
import PostModel from "../models/posts_model";
import { Request, Response } from "express";

const createPost = async (req: Request, res: Response) => {
  const postBody = req.body;
  try {
    console.log("Post Body:", postBody);
    const post = await PostModel.create(postBody);
    console.log("Created Post:", post);
    res.status(201).send(post);
  } catch (error) {
    console.error("Error Creating Post:", error);
    res.status(400).send({ error: (error as Error).message, body: req.body });
  }
};

const getPosts = async (req: Request, res: Response) => {
  const filter = req.query.sender;
  try {
    if (filter) {
      const posts = await PostModel.find({ sender: filter });
      res.send(posts);
    } else {
      const posts = await PostModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const getPostById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    if (post) {
      res.send(post);
    } else {
      res.status(400).send("Post not found");
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const getPostBySender = async (req: Request, res: Response) => {
  const filter = req.query;
  console.log(filter);
  try {
    if (filter.sender) {
      const post = await PostModel.find({ sender: filter.sender });
      res.send(post);
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const updatedPost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { sender, message } = req.body;

  if (!id) {
    return res.status(400).send("Post ID is required");
  }

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(id, {
      sender,
      message,
    });
    if (updatedPost) {
      updatedPost.sender = sender;
      updatedPost.message = message;
      await updatedPost.save();
      res.send(updatedPost);
    } else {
      res.status(400).send("Post not found");
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await postModel.findByIdAndDelete(id);
    return res.send("item deleted");
  } catch (err) {
    return res.status(400).send(err);
  }
};

export default {
  createPost,
  getPosts,
  getPostById,
  getPostBySender,
  updatedPost,
  deleteItem,
};
