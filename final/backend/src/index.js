require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/userModel");       // <--- IMPORT NECESSARIO
const Lesson = require("./models/lessonModel");
const Review  = require("./models/reviewModel");

const { users, lessons, reviews } = require("./uploadDate");

const app = express();
app.use(cors());
app.use(express.json());

// SERVER HTTP + SOCKET.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 🔗 MONGO DB (VERSIONE PER DOCKER)
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/tutoring";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected to tutoring");
    await User.insertMany(users);
    await Lesson.insertMany(lessons);
    await Review.insertMany(reviews); 

    // Controllo utenti
    const userCount = await User.countDocuments();
    console.log(`👤 Users in DB: ${userCount}`);

    // Controllo lezioni
    const lessonCount = await Lesson.countDocuments();
    console.log(`📚 Lessons in DB: ${lessonCount}`);

    // Controllo recensioni
    const reviewCount = await Review.countDocuments();
    console.log(`📝 Reviews in DB: ${reviewCount}`);
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// 🔥 SOCKET.IO HANDLERS
io.on("connection", (socket) => {
  console.log("🔗 Nuovo client connesso:", socket.id);

  const jwtSettings = {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES
  };

  // ROUTES SOCKET
  require("./routes/userRouter")(socket, io, jwtSettings);
  require("./routes/lessonRouter")(socket, io);
  require("./routes/reviewRouter")(socket, io);
  require("./routes/reportRouter")(socket, io, jwtSettings);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnesso:", socket.id);
  });
});

// 🚀 AVVIO SERVER
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://0.0.0.0:${PORT}`);
});

