const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Change username
router.put("/change-username", protect, async (req, res) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({
        message: "New username is required",
      });
    }

    const username = newUsername.trim();

    if (username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters long",
      });
    }

    // Check whether username is already taken
    const existingUser = await User.findOne({
      username,
      _id: { $ne: req.user.userId },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    // Find currently logged-in user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "Admin user not found",
      });
    }

    user.username = username;

    await user.save();

    res.json({
      message: "Username changed successfully",
      username: user.username,
    });
  } catch (error) {
    console.error("Change username error:", error);

    res.status(500).json({
      message: "Failed to change username",
      error: error.message,
    });
  }
});

// ===============================
// Admin Login
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// ===============================
// Refresh Token
// ===============================
router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});

// ===============================
// Change Password
// ===============================
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Get logged-in admin
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "Admin user not found",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
});

module.exports = router;