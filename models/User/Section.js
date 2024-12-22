const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Section", sectionSchema);
