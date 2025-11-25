// reviewSocket.js
const controller = require("../controllers/reviewController");

module.exports = function (socket, io) {

  // -----------------------------------------
  // CREATE REVIEW
  // -----------------------------------------
  socket.on("review:create", async (data, callback) => {
    try {
      const review = await controller.createReviewSocket(data);
      callback({ success: true, data: review });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // -----------------------------------------
  // GET ALL REVIEWS OF LESSONS A USER TOOK
  // -----------------------------------------
  socket.on("review:getAllByUser", async (username, callback) => {
    try {
      const reviews = await controller.getAllUserLessonsReviewSocket(username);
      callback({ success: true, data: reviews });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

};
