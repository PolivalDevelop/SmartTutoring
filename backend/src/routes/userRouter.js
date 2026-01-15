const controller = require("../controllers/userController")
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

module.exports = function (socket, io, jwtSettings) {

  socket.on("user:register", async (data, callback) => {
    try {
      if (data.photo && data.photo.startsWith("data:image/")) {
        const matches = data.photo.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1]; 
          const base64Data = matches[2];
          const filename = `${Date.now()}.${ext}`;
          const filePath = path.join(UPLOAD_DIR, filename);

          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

          data.photo = `/uploads/${filename}`;
        }
      }

      const user = await controller.createUser(data); 
      callback({ success: true, data: user });
    } catch (err) {
      console.error(err);
      callback({ success: false, error: err.message });
    }
  });


  socket.on("session:get", () => {
    controller.getSessionData(socket)
  })

  socket.on("session:login", async (data, callback) => {
  try {
    const user = await controller.loginUser(data, jwtSettings); 
    callback({ success: true, data: user });
  } catch (err) {
    callback({ success: false, error: err.message });
  }
});


  socket.on("session:logout", () => {
    controller.logoutUser(socket)
  })

  socket.on("user:delete", async (data, callback) => {
    try {
      const result = await controller.deleteUser(socket, data)
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
