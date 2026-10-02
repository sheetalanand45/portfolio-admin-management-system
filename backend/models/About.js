const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    education: {
      type: String,
      default: "",
    },

    location: {
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", aboutSchema);