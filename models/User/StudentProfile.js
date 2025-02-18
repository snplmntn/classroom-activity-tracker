const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: {
        values: ["officer", "student", "beadle", "admin"],
        message: "Role must be one of: Officer, Student, Beadle",
      },
      default: "student",
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ["regular", "irregular"],
        message: "Status must be either Regular or Irregular",
      },
      default: "regular",
      lowercase: true,
    },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
