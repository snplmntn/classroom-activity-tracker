const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: [true, "Section name is required"],
    },
    sectionCode: {
      type: String,
      required: [true, "Subject code is required"],
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Section", sectionSchema);
