const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const homeRoutes = require("./routes/homeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const blogRoutes = require("./routes/blogRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const contactInfoRoutes = require("./routes/contactInfoRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/home", homeRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/projects", projectRoutes);
app.use("/skills", skillRoutes);
app.use("/about", aboutRoutes);
app.use("/experience", experienceRoutes);
app.use("/blogs", blogRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/services", serviceRoutes);
app.use("/contact-info", contactInfoRoutes);
app.use("/contact", contactRoutes);
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Portfolio CMS Backend is running!"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});