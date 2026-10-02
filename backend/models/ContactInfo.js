const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Get In Touch",
    },
    description: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema);