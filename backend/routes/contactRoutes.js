const express = require("express");
const Message = require("../models/Msg");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Submit contact form - public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject: subject || "",
      message,
      status: "unread",
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// Get all messages - admin only
router.get("/", protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// Update message status - admin only
router.put("/:id", protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
});

// Delete message - admin only
// Delete message - admin only
router.delete("/:id", protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
});

module.exports = router;