const controller = require("../controllers/reportController");

module.exports = function (socket, io) {
  
  socket.on("report:create", async (data, callback) => {
    try {
      const report = await controller.createReportSocket(data);
      io.emit("report:updated"); 
      callback({ success: true, data: report });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  socket.on("report:delete", async (emailAdmin, id, callback) => {
    try {
      const result = await controller.deleteReportSocket(emailAdmin, id);
      io.emit("report:updated"); 
      callback({ success: true, data: result });
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
