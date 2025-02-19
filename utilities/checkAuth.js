const jwt = require("jsonwebtoken");
const InvalidToken = require("../models/utilities/InvalidToken");
const StudentProfile = require("../models/User/StudentProfile");
const AppError = require("./appError");

const verifyToken = async (req, res, next) => {
  const JWT_KEY = process.env.JWT_KEY;
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    // send back user if no token is provided
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  } else {
    const token = authHeader.split(" ")[1]; // get token from header
    const isInvalid = await InvalidToken.findOne({ token: token });

    if (isInvalid) {
      return next(new AppError("Access denied. Invalid Token", 403));
    }

    // check token if valid
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      req.userId = decoded.user._id;

      // assign user role
      const studentProfile = await StudentProfile.findOne({
        user: decoded.user._id,
      });
      if (studentProfile) req.role = studentProfile.role;
      next();
    } catch (err) {
      // token expired or invalid
      if (err.name === "TokenExpiredError")
        return res
          .status(401)
          .json({ message: "Access denied. Token Expired." });
      else
        return res
          .status(403)
          .json({ message: "Access denied. Invalid Token." });
    }
  }
};

module.exports = verifyToken;
