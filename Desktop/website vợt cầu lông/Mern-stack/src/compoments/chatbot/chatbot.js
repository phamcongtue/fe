
// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3001");

// function Chatbot() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     socket.on("load_messages", (msgs) => setChat(msgs));
//     socket.on("receive_message", (data) => setChat((prev) => [...prev, data]));
//     return () => {
//       socket.off("load_messages");
//       socket.off("receive_message");
//     };
//   }, []);

//   // ✅ Tự động cuộn xuống khi có tin nhắn mới
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   const sendMessage = () => {
//     if (message.trim() === "") return;
//     socket.emit("send_message", { text: message, sender: "Khách hàng" });
//     setMessage("");
//   };

//   return (
//     <>
//       {/* ✅ Bong bóng thu gọn */}
//       {!isOpen && (
//         <div
//           onClick={() => setIsOpen(true)}
//           style={{
//             position: "fixed",
//             bottom: "60px", // 🔽 thấp hơn một chút
//             right: "30px",
//             width: "65px",
//             height: "65px",
//             borderRadius: "50%",
//             backgroundColor: "#4CAF50",
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//             fontSize: "26px",
//             userSelect: "none",
//             transition: "transform 0.2s ease, box-shadow 0.2s ease",
//             zIndex: 1000,
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = "scale(1.1)";
//             e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.3)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "scale(1)";
//             e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
//           }}
//           title="Nhấn để mở chat"
//         >
//           💬
//         </div>
//       )}

//       {/* ✅ Cửa sổ chat với animation */}
//       {isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "130px", // khung nằm cao hơn bong bóng 1 chút
//             right: "40px",
//             width: "320px",
//             border: "1px solid #ccc",
//             borderRadius: "12px",
//             background: "#fff",
//             padding: "10px",
//             boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
//             fontFamily: "Arial, sans-serif",
//             fontSize: "14px",
//             zIndex: 1000,
//             opacity: isOpen ? 1 : 0,
//             transform: isOpen ? "translateY(0)" : "translateY(20px)",
//             transition: "opacity 0.3s ease, transform 0.3s ease",
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "10px",
//               borderBottom: "1px solid #eee",
//               paddingBottom: "6px",
//             }}
//           >
//             <h4 style={{ margin: 0 }}>💬 Chat hỗ trợ</h4>
//             <button
//               onClick={() => setIsOpen(false)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 fontSize: "18px",
//                 cursor: "pointer",
//                 color: "#555",
//               }}
//             >
//               ✖
//             </button>
//           </div>

//           {/* Nội dung chat */}
//           <div
//             style={{
//               maxHeight: "250px",
//               overflowY: "auto",
//               marginBottom: "10px",
//               border: "1px solid #eee",
//               padding: "5px",
//               borderRadius: "5px",
//               background: "#fafafa",
//             }}
//           >
//             {chat.map((c, i) => (
//               <p
//                 key={i}
//                 style={{
//                   wordWrap: "break-word",
//                   whiteSpace: "pre-wrap",
//                   margin: "5px 0",
//                 }}
//               >
//                 <b>{c.sender}:</b> {c.text}
//               </p>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Ô nhập + nút gửi */}
//           <div style={{ display: "flex" }}>
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Nhập tin nhắn..."
//               style={{
//                 flex: 1,
//                 padding: "6px",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//               }}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               style={{
//                 marginLeft: "5px",
//                 padding: "6px 10px",
//                 border: "none",
//                 borderRadius: "5px",
//                 background: "#4CAF50",
//                 color: "#fff",
//                 cursor: "pointer",
//               }}
//             >
//               Gửi
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Chatbot;
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // 🟡 Trạng thái "Bot đang nhập..."
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("load_messages", (msgs) => setChat(msgs));

    socket.on("receive_message", (data) => {
      // Nếu tin nhắn đến từ BOT → thêm delay
      if (data.sender === "Bot") {
        setIsTyping(true); // Hiển thị "Bot đang nhập..."
        const delay = 1000 + Math.random() * 1000; // 1–2 giây ngẫu nhiên
        setTimeout(() => {
          setIsTyping(false);
          setChat((prev) => [...prev, data]);
        }, delay);
      } else {
        // Tin nhắn từ người dùng thì hiển thị ngay
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
    };
  }, []);

  // ✅ Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", { text: message, sender: "Khách hàng" });
    setMessage("");
  };

  return (
    <>
      {/* ✅ Bong bóng thu gọn */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "60px", // 🔽 thấp hơn một chút
            right: "30px",
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            backgroundColor: "#4CAF50",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontSize: "26px",
            userSelect: "none",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
          }}
          title="Nhấn để mở chat"
        >
          💬
        </div>
      )}

      {/* ✅ Cửa sổ chat */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "130px",
            right: "40px",
            width: "320px",
            border: "1px solid #ccc",
            borderRadius: "12px",
            background: "#fff",
            padding: "10px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            zIndex: 1000,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              borderBottom: "1px solid #eee",
              paddingBottom: "6px",
            }}
          >
            <h4 style={{ margin: 0 }}>💬 Chat hỗ trợ</h4>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#555",
              }}
            >
              ✖
            </button>
          </div>

          {/* Nội dung chat */}
          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              marginBottom: "10px",
              border: "1px solid #eee",
              padding: "5px",
              borderRadius: "5px",
              background: "#fafafa",
            }}
          >
            {chat.map((c, i) => (
              <p
                key={i}
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  margin: "5px 0",
                }}
              >
                <b>{c.sender}:</b> {c.text}
              </p>
            ))}

            {/* 🟢 Hiển thị khi bot đang gõ */}
            {isTyping && (
              <p
                style={{
                  fontStyle: "italic",
                  color: "#888",
                  margin: "5px 0",
                }}
              >
                Bot đang nhập...
              </p>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Ô nhập + nút gửi */}
          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "5px",
                padding: "6px 10px",
                border: "none",
                borderRadius: "5px",
                background: "#4CAF50",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
