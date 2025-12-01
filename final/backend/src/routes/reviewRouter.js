// reviewSocket.js
const controller = require("../controllers/reviewController");

module.exports = function (socket, io) {

  // -----------------------------------------
  // CREATE REVIEW
  // -----------------------------------------
  socket.on("review:create", async (data, callback) => {
    try {
      const review = await controller.createReviewSocket(data);
      io.emit("review:updated");
      callback({ success: true, data: review });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  socket.on("review:getByUserEmail", async (email, callback) => {
    try {
      const reviews = await controller.getAllUserReviewSocket(email);
      callback({ success: true, data: reviews });
    } catch (err) {
      callback({ success: false, error: email + " la mail " + err.message });
    }
  });

};
