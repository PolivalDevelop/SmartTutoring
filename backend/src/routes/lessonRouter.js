const controller = require("../controllers/lessonController");

module.exports = function (socket, io) {
  socket.on("lesson:create", async (data, callback) => {
    try {
      const lesson = await controller.createLessonSocket(data);

      callback({ success: true, data: lesson });

      io.emit("lessons:updated");
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  socket.on("lessons:getAvailable", async (callback) => {
    try {
      const lessons = await controller.getAllLessonsSocket();
      socket.emit("lessons:available", lessons);
    } catch (err) {
      socket.emit("lessons:available", { error: err.message });
    }
  });


  socket.on("lesson:modify", async (lesson, callback) => {
    try {
      const modifiedLesson = await controller.modifyLessonSocket(lesson);
      callback({ success: true, data: modifiedLesson });

      io.emit("lessons:updated");
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });



  socket.on("lesson:delete", async (id, callback) => {
    try {
      const deleted = await controller.deleteLessonSocket(id);

      callback({ success: true, data: deleted });

      io.emit("lessons:updated");
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  socket.on("lesson:myBooked", async (email, callback) => {
    try {
      const lessons = await controller.getLessonsByStudentSocket(email);
      callback({ success: true, data: lessons });
    } catch (err) {
      console.error("Errore ottenimento lezioni prenotate:", err, email);
      callback({ success: false, error: err.message });
    }
  });

  socket.on("lesson:myOffered", async (email, callback) => {
    try {
      const lessons = await controller.getLessonsByTeacherSocket(email);
      callback({ success: true, data: lessons });
    } catch (err) {
      console.error("Errore ottenimento lezioni offerte:", err, email);
      callback({ success: false, error: err.message });
    }
  });

  socket.on("lesson:book", async ({ lessonId, studentEmail }, callback) => {
    try {
      const bookedLesson = await controller.bookLessonSocket(lessonId, studentEmail);
      callback({ success: true, data: bookedLesson });

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

