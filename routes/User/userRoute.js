const express = require("express");
const router = express.Router();
const userController = require("../../controllers/User/UserController");

// Get User
router.get("/", userController.user_get);

// Index User
router.get("/a", userController.user_index);

// Delete User
router.delete("/", userController.user_delete);

// Update User
router.put("/", userController.user_update);

module.exports = router;
