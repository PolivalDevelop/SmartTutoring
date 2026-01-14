require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/userModel");       // <--- IMPORT NECESSARIO
const Lesson = require("./models/lessonModel");
const Review  = require("./models/reviewModel");
const Admin  = require("./models/adminModel");
const Report  = require("./models/reportModel");
const path = require("path");

const { users, lessons, reviews, admins, reports } = require("./uploadDate");

const bcrypt = require("bcrypt");

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


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

    const usersWithHashedPasswords = await Promise.all(
      users.map(async user => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );
    await User.insertMany(usersWithHashedPasswords);
    await Lesson.insertMany(lessons);
    await Review.insertMany(reviews); 
    await Admin.insertMany(admins);
    await Report.insertMany(reports);

    // Controllo utenti
    const userCount = await User.countDocuments();

    // Controllo lezioni
    const lessonCount = await Lesson.countDocuments();

    // Controllo recensioni
    const reviewCount = await Review.countDocuments();

    // Controllo admin
    const adminCount = await Admin.countDocuments();

    // Controllo segnalazioni
    const reportCount = await Report.countDocuments();
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// 🔥 SOCKET.IO HANDLERS
io.on("connection", (socket) => {
  const jwtSettings = {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES
  };

  // ROUTES SOCKET
  require("./routes/userRouter")(socket, io, jwtSettings);
  require("./routes/lessonRouter")(socket, io);
  require("./routes/reviewRouter")(socket, io);
  require("./routes/reportRouter")(socket, io, jwtSettings);
  require("./routes/adminRouter")(socket, io, jwtSettings);

  socket.on("disconnect", () => {
    console.log("Client disconnesso:", socket.id);
  });
});

// 🚀 AVVIO SERVER
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://0.0.0.0:${PORT}`);
});

