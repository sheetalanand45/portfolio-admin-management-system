const express = require("express");
const Skill = require("../models/Skill");
const protect = require("../middleware/authMiddleware");    

const router = express.Router();

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
});

// POST a new skill
router.post("/", protect, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create skill",
      error: error.message,
    });
  }
});

// PUT/update a skill
router.put("/:id", protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json(skill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update skill",
      error: error.message,
    });
  }
});

// DELETE a skill
router.delete("/:id", protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete skill",
      error: error.message,
    });
  }
});

module.exports = router;