const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Officer", "Student", "Beadle", "Admin"],
      default: "Student",
    },
    status: {
      type: String,
      enum: ["Regular", "Irregular"],
      default: "Regular",
    },
    profilePicture: {
      type: String,
    },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
