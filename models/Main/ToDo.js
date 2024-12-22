const mongoose = require("mongoose");

const toDoSchema = new mongoose.Schema(
  {
    toDoName: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    submittedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ToDo", toDoSchema);
