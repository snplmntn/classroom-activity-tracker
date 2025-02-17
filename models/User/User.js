const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
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
    profilePicture: {
      type: String,
      // add default profile picture
    },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  },
  {
    timestamps: true,
  }
);

// Index
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model("User", userSchema);
