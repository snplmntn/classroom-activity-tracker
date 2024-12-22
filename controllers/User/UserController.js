const User = require("../../models/User/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");

// Get User by Id or Username
const user_get = catchAsync(async (req, res, next) => {
  const { id, username } = req.query;

  const user = id
    ? await User.findById(id).populate("section")
    : await User.findOne({ username: username }).populate("section");
  const { password, __v, ...other } = user._doc;

  if (!user) return next(new AppError("User not found", 404));

  return res.status(200).json({ message: "User Fetched", other });
});

// Get All Users
const user_index = catchAsync(async (req, res, next) => {
  const accounts = await User.find().populate("section");

  if (!accounts) return next(new AppError("Users not found", 404));

  return res.status(200).json(accounts);
});

// Delete User
const user_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  if (id !== req.userId) {
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "Account Successfully Deleted" });
  } else {
    return res
      .status(403)
      .json({ message: "You can only delete your own account" });
  }
});

// Update User
const user_update = catchAsync(async (req, res, next) => {
  const KEY = process.env.JWT_KEY;
  const { id } = req.query;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not Found.", 404));
  }

  if (req.body.newPassword && req.body.password) {
    const salt = await bcrypt.genSalt(10);

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //User has correct password
    if (isPasswordValid) {
      req.body.password = await bcrypt.hash(req.body.newPassword, salt);
      delete req.body.newPassword;
    } else return next(new AppError("Incorrect Password", 401));
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedUser) return next(new AppError("User not Found.", 404));

  const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const payload = { user: JSON.stringify(updatedUser), exp: expiration };
  const token = jwt.sign(payload, KEY);
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_TEMP_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);

  return res
    .status(200)
    .json({ message: "Account Successfully Updated", token: token });
});

module.exports = {
  user_get,
  user_index,
  user_delete,
  user_update,
};

// user update post structure

//   // ===================== POST =============================
//   let postUpdate = {},
//     commentUpdate = {};

//   if (req.body.profilePicture) {
//     postUpdate.profilePicture = req.body.profilePicture;
//     commentUpdate.profilePicture = req.body.profilePicture;
//   }
//   if (req.body.fullname) {
//     postUpdate.fullName = req.body.fullName;
//     commentUpdate.fullName = req.body.fullname;
//   }
//   if (req.body.cityAddress) postUpdate.address = req.body.cityAddress;

//   //Post
//   await Post.updateMany(
//     { userId: userId },
//     { $set: postUpdate },
//     { new: true }
//   );

//   //Post Comment
//   await PostComment.updateMany(
//     { userId: userId },
//     { $set: commentUpdate },
//     { new: true }
//   );
