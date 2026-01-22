
const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const initChat = require("./chatbot/chatServer"); // socket server

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ================= Middleware =================
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

// ================= Routes =================
// Các routes khác
routes(app);

// Route chatbot REST API
const chatbotRoute = require("./routes/chatbot");
app.use("/api/chatbot", chatbotRoute);

// ================= MongoDB =================
mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => console.log("✅ Connect to database!"))
  .catch((err) => console.log("❌ Database error:", err));

// ================= Socket.io =================
const server = http.createServer(app);
initChat(server); // gắn socket vào server

// ================= Run Server =================
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
