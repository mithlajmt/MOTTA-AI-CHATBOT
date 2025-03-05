require("dotenv").config();
const axios = require("axios");
const ChatHistory = require("../models/ChatHistory");

const chatWithGPT = async (req, res) => {
  try {
    const { message, username } = req.body;
    if (!message || !username) {
      return res.status(400).json({ success: false, error: "Message and username are required" });
    }

    // Fetch last 5 chat history messages
    const chatHistory = await ChatHistory.find({ username })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    const formattedChatHistory = chatHistory.map(entry => ({
      role: "user",
      content: entry.message,
    })).reverse();

    // System message (Motta's personality & behavior
    // Send request to OpenAI GPT
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: process.env.SYSTEM_MESSAGE },
          ...formattedChatHistory,
          { role: "user", content: message },
        ],
        temperature: 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const gptMessage = gptResponse.data.choices[0].message.content;

    // Save chat to database
    await ChatHistory.create({ username, message, response: gptMessage });

    res.json({ success: true, message: gptMessage });
  } catch (error) {
    console.error("❌ Error in chatWithGPT:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: "Error processing your request" });
  }
};

module.exports = { chatWithGPT };
