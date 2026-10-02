const express = require("express");
const About = require("../models/About");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET About information - public
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.json({});
    }

    res.json(about);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch About information",
      error: error.message,
    });
  }
});

// PUT About information - admin only
router.put("/", protect, async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      req.body,
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.json(about);
  } catch (error) {
    console.error("About update error:", error);

    res.status(500).json({
      message: "Failed to update About information",
      error: error.message,
    });
  }
});

module.exports = router;