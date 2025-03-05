const express = require('express');
const router = express.Router();
const { chatWithGPT } = require("../controllers/botController");

router.post("/chat", chatWithGPT);

module.exports = router;




