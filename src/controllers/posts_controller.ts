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
  try {
    await PostModel.find({ sender: req.query.sender });
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { sender, message } = req.body;

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { sender, message },
      { new: true, runValidators: true }
    );

    if (updatedPost) {
      res.status(200).send(updatedPost);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const deletePost = async (req: Request, res: Response) => {
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
  updatePost,
  deletePost,
};
