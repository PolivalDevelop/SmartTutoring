// reportSocket.js
const controller = require("../controllers/reportController");

module.exports = function (socket, io) {
  
  // -----------------------------
  // CREATE REPORT
  // -----------------------------
  socket.on("report:create", async (data, callback) => {
    try {
      const report = await controller.createReportSocket(data);
      callback({ success: true, data: report });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // -----------------------------
  // GET REPORT BY PRODUCT ID
  // -----------------------------
  socket.on("report:getByProductId", async (id, callback) => {
    try {
      const report = await controller.getReportByProductIdSocket(id);
      callback({ success: true, data: report });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // -----------------------------
  // DELETE REPORT
  // -----------------------------
  socket.on("report:delete", async (id, callback) => {
    try {
      const result = await controller.deleteReportSocket(id);
      callback({ success: true, data: result });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // -----------------------------
  // GET ALL REPORTS OF A USER
  // -----------------------------
  socket.on("report:getAllByUser", async (username, callback) => {
    try {
      const reports = await controller.getAllUserReportSocket(username);
      callback({ success: true, data: reports });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

};
