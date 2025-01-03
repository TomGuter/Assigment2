import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;
