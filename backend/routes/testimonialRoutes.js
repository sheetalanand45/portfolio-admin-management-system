const express = require("express");
const Testimonial = require("../models/Testimonial");
const protect = require("../middleware/authMiddleware");    

const router = express.Router();

// GET all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      createdAt: -1,
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
});

// POST testimonial
router.post("/", protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create testimonial",
      error: error.message,
    });
  }
});

// PUT testimonial
router.put("/:id", protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.json(testimonial);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
});

// DELETE testimonial
router.delete("/:id", protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
});

module.exports = router;