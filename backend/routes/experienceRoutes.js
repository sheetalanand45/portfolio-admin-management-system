const express = require("express");
const Experience = require("../models/Experience");
const protect = require("../middleware/authMiddleware");    

const router = express.Router();

// GET all experience
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      createdAt: -1,
    });

    res.json(experiences);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch experience",
      error: error.message,
    });
  }
});

// POST new experience
router.post("/", protect, async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create experience",
      error: error.message,
    });
  }
});

// PUT/update experience
router.put("/:id", protect, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.json(experience);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update experience",
      error: error.message,
    });
  }
});

// DELETE experience
router.delete("/:id", protect, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(
      req.params.id
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete experience",
      error: error.message,
    });
  }
});

module.exports = router;