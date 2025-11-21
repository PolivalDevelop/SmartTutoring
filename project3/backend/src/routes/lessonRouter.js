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
      socket.emit("lessons:available", lessons);
    } catch (err) {
      socket.emit("lessons:available", { error: err.message });
    }
  });


  // ------------------------------------
  // GET ALL LESSONS
  // ------------------------------------
  socket.on("lesson:getAll", async (callback) => {
    try {
      const lessons = await controller.getAllLessonsSocket(true); 
      // true = include all lessons (not filtered)
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // GET LESSON BY ID
  // ------------------------------------
  socket.on("lesson:getById", async (id, callback) => {
    try {
      const lesson = await controller.getLessonByIdSocket(id);
      callback({ success: true, data: lesson });
    } catch (err) {
      callback({ success: false, error: err.message });
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


  // ------------------------------------
  // GET LESSONS BY SUBJECT
  // ------------------------------------
  socket.on("lesson:bySubject", async (subject, callback) => {
    try {
      const lessons = await controller.getLessonsBySubjectSocket(subject);
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // GET LESSONS BY DATE
  // ------------------------------------
  socket.on("lesson:byDate", async (date, callback) => {
    try {
      const lessons = await controller.getLessonsByDateSocket(date);
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // GET LESSONS BY TEACHER
  // ------------------------------------
  socket.on("lesson:byTeacher", async (teacher, callback) => {
    try {
      const lessons = await controller.getLessonsByTeacherSocket(teacher);
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // GET LESSONS BY STUDENT
  // ------------------------------------
  socket.on("lesson:byStudent", async (student, callback) => {
    try {
      const lessons = await controller.getLessonsByStudentSocket(student);
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // GET LESSONS BY STATUS
  // ------------------------------------
  socket.on("lesson:byStatus", async (status, callback) => {
    try {
      const lessons = await controller.getLessonsByStatusSocket(status);
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // GET LESSONS BY PRICE RANGE
  // ------------------------------------
  socket.on("lesson:byPriceRange", async ({ minPrice, maxPrice }, callback) => {
    try {
      const lessons = await controller.getLessonsByPriceRangeSocket(minPrice, maxPrice);
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });


  // ------------------------------------
  // ADVANCED SEARCH
  // ------------------------------------
  socket.on("lesson:search", async (filters, callback) => {
    try {
      const lessons = await controller.searchLessonsSocket(filters);
      callback({ success: true, data: lessons });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

};
