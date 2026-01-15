require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/userModel");
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


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

    const userCount = await User.countDocuments();

    const lessonCount = await Lesson.countDocuments();

    const reviewCount = await Review.countDocuments();

    const adminCount = await Admin.countDocuments();

    const reportCount = await Report.countDocuments();
  })
  .catch((err) => console.error("MongoDB error:", err));

io.on("connection", (socket) => {
  const jwtSettings = {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES
  };

  require("./routes/userRouter")(socket, io, jwtSettings);
  require("./routes/lessonRouter")(socket, io);
  require("./routes/reviewRouter")(socket, io);
  require("./routes/reportRouter")(socket, io, jwtSettings);
  require("./routes/adminRouter")(socket, io, jwtSettings);

  socket.on("disconnect", () => {
    console.log("Client disconnesso:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
});

