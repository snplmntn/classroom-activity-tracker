const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Answer content is required"],
    },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    upVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Answer", answerSchema);
