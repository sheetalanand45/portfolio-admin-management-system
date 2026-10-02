const express = require("express");
const multer = require("multer");
const path = require("path");

const Media = require("../models/Media");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Upload image
router.post(
  "/image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const media = await Media.create({
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      res.status(201).json({
        message: "Image uploaded successfully",
        media,
      });
    } catch (error) {
      res.status(500).json({
        message: "Image upload failed",
        error: error.message,
      });
    }
  }
);

// Get all uploaded images
router.get("/images", protect, async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });

    res.json(media);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch media",
      error: error.message,
    });
  }
});

// Delete uploaded image record
router.delete("/:id", protect, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);

    if (!media) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    res.json({
      message: "Media deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete media",
      error: error.message,
    });
  }
});

module.exports = router;