// // Tom-Guter-316487230
// // Hodaya-Karo-322579848

import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoutes from "./routes/posts_route";
import commentsRoutes from "./routes/comment_route";
import userRouter from "./routes/user_route";

dotenv.config();

const moduleApp = async (): Promise<Express> => {
  if (!process.env.DB_CONNECT) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/posts", postsRoutes);
  app.use("/comments", commentsRoutes);
  app.use("/auth", userRouter);

  return app;
};

export default moduleApp;
