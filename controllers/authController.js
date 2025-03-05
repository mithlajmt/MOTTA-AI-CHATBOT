require("dotenv").config();
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: "Username is required" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, error: "Username already taken" });
    }

    // Create new user
    await User.create({ username });

    res.json({ success: true, message: `Username '${username}' saved successfully!`, username });
  } catch (err) {
    console.error("❌ Error in signup:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { signup };
