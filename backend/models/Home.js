const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema(
  {
    greeting: {
      type: String,
      default: "Hello, I'm",
    },
    name: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    primaryButtonText: {
      type: String,
      default: "View My Projects",
    },
    secondaryButtonText: {
      type: String,
      default: "Contact Me",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", homeSchema);