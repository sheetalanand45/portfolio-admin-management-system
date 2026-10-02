const express = require("express");
const ContactInfo = require("../models/ContactInfo");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get Contact Info - Public
router.get("/", async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      return res.json({});
    }

    res.json(contactInfo);
  } catch (error) {
    console.error("Contact info fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch contact information",
      error: error.message,
    });
  }
});

// Update Contact Info - Admin only
router.put("/", protect, async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOneAndUpdate(
      {},
      req.body,
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      message: "Contact information updated successfully",
      data: contactInfo,
    });
  } catch (error) {
    console.error("Contact info update error:", error);

    res.status(500).json({
      message: "Failed to update contact information",
      error: error.message,
    });
  }
});

module.exports = router;
