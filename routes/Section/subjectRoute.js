const express = require("express");
const router = express.Router();
const SubjectController = require("../../controllers/Section/SubjectController");

// Get Subject
router.get("/", SubjectController.subject_get);

// Create Subject
router.post("/", SubjectController.subject_post);

// Update Subject
router.put("/", SubjectController.subject_put);

// Delete Subject
router.delete("/", SubjectController.subject_delete);

module.exports = router;
