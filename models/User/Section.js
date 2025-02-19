const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: [true, "Section name is required"],
    },
    sectionCode: {
      type: String,
      required: [true, "Section code is required"],
      lowercase: true,
      unique: [true, "Section code already exists"],
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  {
    timestamps: true,
  }
);

// Index
sectionSchema.index({ sectionCode: 1 });

module.exports = mongoose.model("Section", sectionSchema);
