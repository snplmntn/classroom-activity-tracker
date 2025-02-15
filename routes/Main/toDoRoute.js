const express = require("express");
const router = express.Router();
const ToDoController = require("../../controllers/Main/ToDoController");

// Get To Do
router.get("/", ToDoController.toDo_get);

// Get User To Do
router.get("/u", ToDoController.toDo_userGet);

// Create To Do
router.post("/", ToDoController.toDo_post);

// Update To Do
router.put("/", ToDoController.toDo_put);

//Submit To Do
router.put("/s", ToDoController.toDo_submit);

// Delete To Do
router.delete("/", ToDoController.toDo_delete);

module.exports = router;
