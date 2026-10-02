const express = require("express");
const Service = require("../models/Service");
const protect = require("../middleware/authMiddleware");    

const router = express.Router();

// GET all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({
      createdAt: -1,
    });

    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
});

// POST service
router.post("/", protect, async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
});

// PUT service
router.put("/:id", protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
});

// DELETE service
router.delete("/:id", protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete service",
      error: error.message,
    });
  }
});

module.exports = router;