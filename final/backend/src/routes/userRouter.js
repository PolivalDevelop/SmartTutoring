// socket/userSocket.js

const controller = require("../controllers/userController")
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

module.exports = function (socket, io, jwtSettings) {

  // 1. /  → createUser
  socket.on("user:register", async (data, callback) => {
    try {
      console.log("Registering user with data:", data);
      if (data.photo && data.photo.startsWith("data:image/")) {
        console.log("Processing base64 photo data");
        const matches = data.photo.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches) {
          console.log("Base64 photo data matched");
          const ext = matches[1]; // png, jpeg, ecc.
          const base64Data = matches[2];
          const filename = `${Date.now()}.${ext}`;
          const filePath = path.join(UPLOAD_DIR, filename);

          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

          // Aggiorna il path della foto nel formato che il client può richiedere
          data.photo = `/uploads/${filename}`;
        }
      }
      console.log("User data after processing photo:", data);

      const user = await controller.createUser(data); 
      callback({ success: true, data: user });
    } catch (err) {
      console.error(err);
      console.log(`Error data: ${JSON.stringify(data)}`);
      callback({ success: false, error: err.message });
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

  // 6. /:username DELETE → deleteUser
  socket.on("user:delete", (data, callback) => {
    try {
      const result = controller.deleteUser(socket, data)
      callback({ success: true, data: result })
    } catch (err) {
      callback({ success: false, error: err.message })
    }
  })

  socket.on("user:getByEmail", (data, callback) => {
    controller.getUserByEmail(socket, data.email, callback)
  })

  socket.on("user:updateProfile", (email, updatedData, callback) => {
    controller.updateUserProfile(socket, email, updatedData, callback)
  })

}
