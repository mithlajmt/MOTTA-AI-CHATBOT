const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
  username: String,
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
