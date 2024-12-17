const express = require("express");
const router = express.Router();
const authController = require("../../controllers/User/AuthController");

// Sign up
router.post("/signup", authController.post_sign_up);

// Login
router.post("/login", authController.post_login);

module.exports = router;
