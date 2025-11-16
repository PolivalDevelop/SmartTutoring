// socket/userSocket.js

const controller = require("../controllers/userController")

module.exports = function (socket, io, jwtSettings) {

  // 1. /  → createUser
  socket.on("createUser", (data) => {
    controller.createUser(socket, data)
  })

  // 2. /session → getSessionData
  socket.on("session:get", () => {
    controller.getSessionData(socket)
  })

  // 3. /session/login  → loginUser
  socket.on("session:login", (data) => {
    controller.loginUser(socket, data, jwtSettings)
  })

  // 4. /session/logout → logoutUser
  socket.on("session:logout", () => {
    controller.logoutUser(socket)
  })

  // 5. /:username → searchByUsername
  socket.on("user:searchByUsername", (username) => {
    controller.searchByUsername(socket, username)
  })

  // 6. /:username DELETE → deleteUser
  socket.on("user:delete", (data) => {
    // data = { username, password }
    controller.deleteUser(socket, data)
  })

  // 7. /id/:id  → searchById
  socket.on("user:searchById", (id) => {
    controller.searchById(socket, id)
  })

}
