// src/controllers/chatbotController.js
const chatbotController = {
    getReply: (req, res) => {
        const { message } = req.body;

        let reply = "Xin lỗi, tôi chưa hiểu ý bạn 😅";

        // Xử lý theo từ khóa
        if (message.toLowerCase().includes("chào")) {
            reply = "Chào bạn 👋 Rất vui được hỗ trợ!";
        }
        if (message.toLowerCase().includes("tạm biệt")) {
            reply = "Tạm biệt nhé 👋 Hẹn gặp lại!";
        }

        return res.json({ reply });
    }
};

module.exports = chatbotController;
