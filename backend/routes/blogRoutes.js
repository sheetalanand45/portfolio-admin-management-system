const express = require("express");
const Blog = require("../models/Blog");
const protect = require("../middleware/authMiddleware");    

const router = express.Router();

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
});

// POST a new blog
router.post("/", protect, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create blog",
      error: error.message,
    });
  }
});

// PUT/update a blog
router.put("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(blog);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update blog",
      error: error.message,
    });
  }
});

// DELETE a blog
router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete blog",
      error: error.message,
    });
  }
});

module.exports = router;