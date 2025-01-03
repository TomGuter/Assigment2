import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
  },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

export default CommentModel;
