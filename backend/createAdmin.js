const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const username = "admin";
    const password = "Admin@123";

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("Admin user already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });

    console.log("Admin user created successfully.");
    console.log("Username:", username);
    console.log("Password:", password);

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();