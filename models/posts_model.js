const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model("Posts", postSchema);

module.exports = postModel;
