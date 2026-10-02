const express = require("express");
const Home = require("../models/Home");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get Home content - Public
router.get("/", async (req, res) => {
  try {
    const home = await Home.findOne();

    if (!home) {
      return res.json({});
    }

    res.json(home);
  } catch (error) {
    console.error("Home fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch Home content",
      error: error.message,
    });
  }
});

// Update Home content - Admin only
router.put("/", protect, async (req, res) => {
  try {
    const home = await Home.findOneAndUpdate(
      {},
      req.body,
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      message: "Home content updated successfully",
      data: home,
    });
  } catch (error) {
    console.error("Home update error:", error);

    res.status(500).json({
      message: "Failed to update Home content",
      error: error.message,
    });
  }
});

module.exports = router;