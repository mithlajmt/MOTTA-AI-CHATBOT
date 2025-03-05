require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const botRoutes = require("./routes/bot");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

.then(() =>{
   console.log("✅ Connected to MongoDB")
   app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
  })

.catch(err => {
  console.error("❌ Database Connection Failed: ", err);
  process.exit(1);
});

// Routes
app.use("/motta", botRoutes);
app.use("/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5001;

