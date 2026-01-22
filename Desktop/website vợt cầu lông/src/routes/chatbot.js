const express = require("express");
const router = express.Router();

// Chatbot API: phản hồi text
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  let reply = "Xin lỗi, tôi chưa hiểu ý bạn 😅";

  if (message && message.toLowerCase().includes("chào")) {
    reply = "Chào bạn 👋 Rất vui được hỗ trợ!";
  } else if (message && message.toLowerCase().includes("tạm biệt")) {
    reply = "Tạm biệt nhé 👋 Hẹn gặp lại!";
  } else if (message) {
    reply = "Bạn vừa nói: " + message;
  }

  res.json({ reply });
});

module.exports = router;
