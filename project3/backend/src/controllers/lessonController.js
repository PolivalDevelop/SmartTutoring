// lessonController.js (versione Socket.io)

const Lesson = require("../models/lessonModel");
const User = require("../models/userModel");

// ----------------------------------------
// CREATE LESSON
// ----------------------------------------
exports.createLessonSocket = async (data) => {
  const { teacher, student, subject, date, duration, cost, status, notes } = data;

  if (!teacher || !subject || !date || !cost) {
    throw new Error("Missing required fields.");
  }

  const newLesson = new Lesson({
    teacher,
    student: student || null,
    subject,
    date,
    duration: duration || 60,
    cost,
    status: status || "available",
    notes: notes || "",
  });

  return await newLesson.save();
};

// ----------------------------------------
// GET ALL LESSONS
// ----------------------------------------


exports.getAllLessonsSocket = async () => {
  try {
    const now = new Date();

    const lessons = await Lesson.find({
      student: null,
      status: "available",
      date: { $gte: now } 
    })
      .select("-student")
      .populate("teacher", "firstName lastName email")
      .sort({ date: 1 }); 

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};



// ----------------------------------------
// GET LESSON BY ID
// ----------------------------------------
exports.getLessonByIdSocket = async (id) => {
  const lesson = await Lesson.findById(id)
    .populate("teacher", "firstName lastName email")
    .populate("student", "firstName lastName email");

  if (!lesson) throw new Error("Lesson not found");

  return lesson;
};

// ----------------------------------------
// DELETE LESSON
// ----------------------------------------
exports.deleteLessonSocket = async (id) => {
  const deleted = await Lesson.findByIdAndDelete(id);

  if (!deleted) throw new Error("Lesson not found");

  return { message: "Lesson deleted successfully" };
};

// ----------------------------------------
// GET LESSONS BY SUBJECT
// ----------------------------------------
exports.getLessonsBySubjectSocket = async (subject) => {
  return await Lesson.find({ subject })
    .populate("teacher", "firstName lastName")
    .populate("student", "firstName lastName");
};

// ----------------------------------------
// GET LESSONS BY DATE
// ----------------------------------------
exports.getLessonsByDateSocket = async (dateString) => {
  const date = new Date(dateString);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  return await Lesson.find({ date: { $gte: date, $lt: nextDay } })
    .populate("teacher", "firstName lastName")
    .populate("student", "firstName lastName");
};

// ----------------------------------------
// GET LESSONS BY TEACHER
// ----------------------------------------
exports.getLessonsByTeacherSocket = async (teacherId) => {
  return await Lesson.find({ teacher: teacherId })
    .populate("teacher", "firstName lastName")
    .populate("student", "firstName lastName");
};

// ----------------------------------------
// GET LESSONS BY STUDENT
// ----------------------------------------
exports.getLessonsByStudentSocket = async (studentId) => {
  return await Lesson.find({ student: studentId })
    .populate("teacher", "firstName lastName")
    .populate("student", "firstName lastName");
};

// ----------------------------------------
// GET LESSONS BY STATUS
// ----------------------------------------
exports.getLessonsByStatusSocket = async (status) => {
  return await Lesson.find({ status })
    .populate("teacher", "firstName lastName")
    .populate("student", "firstName lastName");
};

// ----------------------------------------
// GET LESSONS BY PRICE RANGE
// ----------------------------------------
exports.getLessonsByPriceRangeSocket = async (minPrice, maxPrice) => {
  minPrice = parseFloat(minPrice);
  maxPrice = parseFloat(maxPrice);

  return await Lesson.find({
    cost: { $gte: minPrice, $lte: maxPrice },
  })
    .populate("teacher", "firstName lastName")
    .populate("student", "firstName lastName");
};

// ----------------------------------------
// ADVANCED / COMPOSITE SEARCH
// ----------------------------------------
exports.searchLessonsSocket = async (query) => {
  const {
    subject,
    status,
    teacher,
    student,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  } = query;

  const filter = {};

  if (subject) filter.subject = subject;
  if (status) filter.status = status;
  if (teacher) filter.teacher = teacher;
  if (student) filter.student = student;

  if (minPrice || maxPrice) {
    filter.cost = {
      ...(minPrice ? { $gte: parseFloat(minPrice) } : {}),
      ...(maxPrice ? { $lte: parseFloat(maxPrice) } : {}),
    };
  }

  if (startDate || endDate) {
    filter.date = {
      ...(startDate ? { $gte: new Date(startDate) } : {}),
      ...(endDate ? { $lte: new Date(endDate) } : {}),
    };
  }

  return await Lesson.find(filter)
    .populate("teacher", "firstName lastName")
    .populate("student", "firstName lastName")
    .sort({ date: 1 });
};

exports.getLessonsByStudentSocket = async (email) => {
  if (!email) throw new Error("Email dello studente non fornita");

  const now = new Date();

  const lessons = await Lesson.find({
      student: email,
      date: { $gte: now } // solo date future
    })
    .sort({ date: 1 }); // ordina per data crescente

  return lessons;
};

exports.getLessonsByTeacherSocket = async (email) => {
  if (!email) throw new Error("Email dell'insegnante non fornita");

  const now = new Date();

  const lessons = await Lesson.find({
      teacher: email,
      date: { $gte: now } // solo date future
    })
    .sort({ date: 1 }); // ordina per data crescente

  return lessons;
};

exports.bookLessonSocket = async (lessonId, studentEmail) => {
  if (!lessonId) throw new Error("Lesson ID mancante");
  if (!studentEmail) throw new Error("Email dello studente mancante");

  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    throw new Error("Lezione non trovata");
  }

  if (lesson.status !== "available") {
    throw new Error("La lezione è già stata prenotata");
  }

  lesson.student = studentEmail;
  lesson.status = "booked";

  await lesson.save();

  return lesson;
};
