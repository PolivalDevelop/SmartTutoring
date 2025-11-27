
const controller = require("../controllers/adminController");

module.exports = function (socket, io) {

    socket.on("admin:check", async (emailAdmin, callback) => {
        try {
            await controller.checkAdminSocket(emailAdmin);
            callback({ success: true });
        } catch (err) {
            callback({ success: false, error: err.message });
        }
    });
}