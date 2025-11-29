// lessonSocket.js
const controller = require("../controllers/lessonController");

module.exports = function (socket, io) {

  // ------------------------------------
  // CREATE LESSON
  // ------------------------------------
  socket.on("lesson:create", async (data, callback) => {
    try {
      const lesson = await controller.createLessonSocket(data);

      callback({ success: true, data: lesson });

      // Notifica tutti i client che le lezioni sono cambiate
      io.emit("lessons:updated");
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // GET AVAILABLE LESSONS (student = null, status = "available")
  // ------------------------------------
  socket.on("lessons:getAvailable", async (callback) => {
    try {
      const lessons = await controller.getAllLessonsSocket();
      console.log("Lezioni disponibili ottenute:", lessons);
      socket.emit("lessons:available", lessons);
    } catch (err) {
      socket.emit("lessons:available", { error: err.message });
    }
  });



  // ------------------------------------
  // DELETE LESSON
  // ------------------------------------
  socket.on("lesson:delete", async (id, callback) => {
    try {
      const deleted = await controller.deleteLessonSocket(id);

      callback({ success: true, data: deleted });

      // Notifica aggiornamento
      io.emit("lessons:updated");
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  socket.on("lesson:myBooked", async (email, callback) => {
    try {
      const lessons = await controller.getLessonsByStudentSocket(email);
      console.log("Lezioni prenotate ottenute:", lessons);
      callback({ success: true, data: lessons });
    } catch (err) {
      console.error("Errore ottenimento lezioni prenotate:", err, email);
      callback({ success: false, error: err.message });
    }
  });

  socket.on("lesson:myOffered", async (email, callback) => {
    try {
      const lessons = await controller.getLessonsByTeacherSocket(email);
      console.log("Lezioni offerte ottenute:", lessons);
      callback({ success: true, data: lessons });
    } catch (err) {
      console.error("Errore ottenimento lezioni offerte:", err, email);
      callback({ success: false, error: err.message });
    }
  });

  socket.on("lesson:book", async ({ lessonId, studentEmail }, callback) => {
    try {
      const bookedLesson = await controller.bookLessonSocket(lessonId, studentEmail);
      console.log("Lezione prenotata:", bookedLesson);
      callback({ success: true, data: bookedLesson });

      // Notifica aggiornamento
      io.emit("lessons:updated");
    } catch (err) {
      console.error("Errore prenotazione lezione:", err, lessonId, studentEmail);
      callback({ success: false, error: err.message });
    }
  }); 

  socket.on("lessons:getMatter", async (callback) => {
    try {
      const matters = await controller.getMattersSocket();
      callback({ success: true, matters });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

};

