// reportSocket.js
const controller = require("../controllers/reportController");

module.exports = function (socket, io) {
  
  // -----------------------------
  // CREATE REPORT
  // -----------------------------
  socket.on("report:create", async (data, callback) => {
    try {
      const report = await controller.createReportSocket(data);
      socket.emit("report:updated"); // Notify all clients
      callback({ success: true, data: report });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // -----------------------------
  // GET REPORT BY PRODUCT ID
  // -----------------------------
  socket.on("report:getByProductId", async (emailAdmin, id, callback) => {
    try {
      const report = await controller.getReportByProductIdSocket(emailAdmin, id);
      callback({ success: true, data: report });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // -----------------------------
  // DELETE REPORT
  // -----------------------------
  socket.on("report:delete", async (emailAdmin, id, callback) => {
    try {
      const result = await controller.deleteReportSocket(emailAdmin, id);
      socket.emit("report:updated"); // Notify all clients
      callback({ success: true, data: result });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // -----------------------------
  // GET ALL REPORTS OF A USER
  // -----------------------------
  socket.on("report:getAllByUser", async (emailAdmin, username, callback) => {
    try {
      const reports = await controller.getAllUserReportSocket(emailAdmin, username);
      callback({ success: true, data: reports });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  socket.on("report:getOpen", async (emailAdmin, callback) => {
    try {

      const reports = await controller.getOpenReportsSocket(emailAdmin);
      socket.emit("report:open", reports);
    } catch (err) {
      socket.emit("report:open", { error: err.message });
    }
  });
}
