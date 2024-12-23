const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
