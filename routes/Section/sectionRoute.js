const express = require("express");
const router = express.Router();
const SectionController = require("../../controllers/Section/SectionController");

// Get Section
router.get("/", SectionController.section_get);

// Create Section
router.post("/", SectionController.section_post);

// Update Section
router.put("/", SectionController.section_put);

// Enroll / Unenroll Section
router.put("/e", SectionController.section_enroll);

// Delete Section
router.delete("/", SectionController.section_delete);

module.exports = router;
