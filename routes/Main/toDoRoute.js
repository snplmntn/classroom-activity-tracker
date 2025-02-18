const express = require("express");
const router = express.Router();
const ToDoController = require("../../controllers/Main/ToDoController");
const checkRole = require("../../utilities/checkRole");

// Get To Do
router.get("/", ToDoController.toDo_get);

// Get User To Do
router.get("/u", ToDoController.toDo_userGet);

// Create To Do
router.post(
  "/",
  checkRole("officer", "beadle", "admin"),
  ToDoController.toDo_post
);

// Update To Do
router.put(
  "/",
  checkRole("officer", "beadle", "admin"),
  ToDoController.toDo_put
);

//Submit To Do
router.put("/s", ToDoController.toDo_submit);

// Delete To Do
router.delete(
  "/",
  checkRole("officer", "beadle", "admin"),
  ToDoController.toDo_delete
);

module.exports = router;
