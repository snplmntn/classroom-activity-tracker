const express = require("express");
const router = express.Router();
const SectionController = require("../../controllers/Section/SectionController");

// Get User
router.get("/", SectionController.section_get);

// Create User
router.post("/a", SectionController.section_post);

// Update User
router.put("/", SectionController.section_put);

// Delete User
router.delete("/", SectionController.section_delete);

module.exports = router;
