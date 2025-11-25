// socket/userSocket.js

const controller = require("../controllers/userController")

module.exports = function (socket, io, jwtSettings) {

  // 1. /  → createUser
  socket.on("user:register", async (data, callback) => {
    try {
      const user = await controller.createUser(data); // controller ritorna l'utente creato
      callback({ success: true, data: user });
    } catch (err) {
      console.error(err);
      console.log(`Error data: ${JSON.stringify(data)}`);
      callback({ success: false, error: `(data: ${JSON.stringify(data)})` });
    }
  });


  // 2. /session → getSessionData
  socket.on("session:get", () => {
    controller.getSessionData(socket)
  })

  // 3. /session/login  → loginUser
  socket.on("session:login", async (data, callback) => {
  try {
    const user = await controller.loginUser(data, jwtSettings); // controller ritorna utente o token
    callback({ success: true, data: user });
  } catch (err) {
    callback({ success: false, error: err.message });
  }
});


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

  socket.on("user:getByEmail", (data, callback) => {
    controller.getUserByEmail(socket, data.email, callback)
  })

  socket.on("user:updateProfile", (email, updatedData, callback) => {
    controller.updateUserProfile(socket, email, updatedData, callback)
  })

}
