const User = require("../../models/User/User");
const InvalidToken = require("../../models/utilities/InvalidToken");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const post_sign_up = catchAsync(async (req, res, next) => {
  const { fullName, email, password, username } = req.body;

  if (!fullName || !email || !password || !username) {
    return next(
      new AppError("Please fill up all the needed information.", 400)
    );
  }

  // Check if user already exists
  const isUserEmail = await User.findOne({ email });

  if (isUserEmail) {
    return next(new AppError("Email already used.", 400));
  }

  const isUsername = await User.findOne({ username });

  if (isUsername) {
    return next(new AppError("Username already exists.", 400));
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const userDetails = await User.create({
    fullName,
    email,
    username,
    password: hashedPassword, // Save the hashed password
  });

  return res
    .status(200)
    .json({ message: "Signed up successfully ", userDetails });
});

// Login route
const post_login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: username }, { username }],
  }).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  await User.findByIdAndUpdate(user._id, { logInTime: Date.now() });

  const token = jwt.sign({ user: user }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  return res.json({
    user,
    token,
  });
});

// Logout route
const post_logout = catchAsync(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader.split(" ")[1]; // get token from header

  const verify = jwt.verify(token, process.env.JWT_KEY);
  if (!verify) {
    return next(new AppError("Invalid Token", 403));
  }

  const invalidToken = await InvalidToken.create({
    token: token,
  });

  return res
    .status(200)
    .json({ message: "Logged Out Successfully", invalidToken });
});

module.exports = {
  post_sign_up,
  post_login,
  post_logout,
};
