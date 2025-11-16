require("dotenv").config()

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// MongoDB
mongoose
  .connect("mongodb://localhost:27017/tutoring", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected to tutoring"))
  .catch((err) => console.error("❌ MongoDB error:", err))

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("🔗 Nuovo client connesso:", socket.id)

  const jwtSettings = {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES
  }

  // 🔥 COLLEGAMENTO DELLA ROUTE SOCKET
  require("./routes/userRouter")(socket, io, jwtSettings)
  require("./routes/lessonRouter")(socket, io)
  require("./routes/reviewRouter")(socket, io)
  require("./routes/reportRouter")(socket, io, jwtSettings)

  socket.on("disconnect", () => {
    console.log("❌ Client disconnesso:", socket.id)
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`)
})
