const mongoose = require("mongoose");

const toDoSchema = new mongoose.Schema(
  {
    toDoName: {
      type: String,
      required: [true, "To Do name is required"],
    },
    description: String,
    deadline: {
      type: Date,
    },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    submittedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "To Do Subject ID is required"],
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "To Do Section ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ToDo", toDoSchema);
