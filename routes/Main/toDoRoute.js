const express = require("express");
const router = express.Router();
const ToDoController = require("../../controllers/Main/ToDoController");

// Get ToDo
router.get("/", ToDoController.toDo_get);

// Create ToDo
router.post("/", ToDoController.toDo_post);

// Update ToDo
router.put("/", ToDoController.toDo_put);

//Submit
router.put("/s", ToDoController.toDo_submit);

// Delete ToDo
router.delete("/", ToDoController.toDo_delete);

module.exports = router;
