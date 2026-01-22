const { Server } = require("socket.io");

// Lưu trạng thái hội thoại của từng client
const userContext = {};

function initChat(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    // Khởi tạo context
    userContext[socket.id] = { step: null };

    // Gửi lời chào ban đầu
    socket.emit("load_messages", [
      { sender: "Bot", text: "Xin chào 👋, tôi có thể giúp gì cho bạn?" }
    ]);

    // Nhận tin nhắn từ client
    socket.on("send_message", (data) => {
      console.log("💬 Khách gửi:", data);

      let msg = data.text.toLowerCase();
      let reply = "Xin lỗi, tôi chưa hiểu ý bạn 😅";

      // --- Kiểm tra ngữ cảnh trước ---
      if (userContext[socket.id].step === "choosing_racket") {
        if (msg.includes("nhẹ")) {
          reply = "✨ Với vợt nhẹ, mình gợi ý dòng Yonex Nanoflare – dễ điều khiển và phù hợp người mới.";
        } else if (msg.includes("cân bằng")) {
          reply = "⚖️ Vợt cân bằng thì Yonex Arcsaber là lựa chọn tuyệt vời.";
        } else if (msg.includes("thiên công")) {
          reply = "💥 Nếu bạn thích smash mạnh, thử Yonex Astrox – rất hợp lối đánh tấn công.";
        } else {
          reply = "Bạn muốn loại vợt nhẹ, cân bằng hay thiên công?";
        }
        // Sau khi tư vấn, reset trạng thái
        userContext[socket.id].step = null;
      }
      // --- Rule bình thường ---
      else if (msg.includes("chào")) {
        reply = "Chào bạn 👋 Rất vui được hỗ trợ!";
      } 
      else if (msg.includes("tư vấn")) {
        reply = "🏸 Shop hiện có nhiều loại vợt cầu lông. Bạn quan tâm loại vợt nhẹ, cân bằng hay thiên công?";
        userContext[socket.id].step = "choosing_racket"; // bật trạng thái chọn vợt
      }
      else if (msg.includes("thanh toán")) {
        reply = "💳 Bạn có thể thanh toán qua: \n- Chuyển khoản ngân hàng \n- Thanh toán khi nhận hàng (COD) \n- Ví điện tử VNPay.";
      }
      else if (msg.includes("tạm biệt")) {
        reply = "Tạm biệt nhé 👋 Hẹn gặp lại!";
      }
      else {
        reply = "Bạn vừa nói: " + data.text;
      }

      // Gửi lại tin nhắn khách vừa gửi
      io.emit("receive_message", data);

      // Bot trả lời
      io.emit("receive_message", { sender: "Bot", text: reply });
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      delete userContext[socket.id]; // xóa context khi user out
    });
  });
}

module.exports = initChat;
