const express = require("express");
const router = express.Router();
const authController = require("../../controllers/User/AuthController");
const checkAuth = require("../../utilities/checkAuth");

// Sign up
router.post("/signup", authController.post_sign_up);

// Login
router.post("/login", authController.post_login);

// Logout
router.post("/logout", checkAuth, authController.post_logout);

module.exports = router;
