const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
    },
    subjectColor: {
      type: String,
      required: [true, "Subject color is required"],
    },
    professor: String,
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "Section ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", subjectSchema);
