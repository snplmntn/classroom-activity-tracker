const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
    },
    content: {
      type: String,
      required: [true, "Question content is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Question subject category is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Question Author ID is required"],
    },
    upVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isSolved: {
      type: Boolean,
      default: false,
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
