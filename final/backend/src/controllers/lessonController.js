// lessonController.js (versione Socket.io)

const Lesson = require("../models/lessonModel");
const User = require("../models/userModel");

// ----------------------------------------
// CREATE LESSON
// ----------------------------------------
exports.createLessonSocket = async (data) => {
  const { teacher, subject, date, duration, price } = data;

  if (!teacher || !subject || !date || !price) {
    throw new Error("Missing required fields.");
  }

  const newLesson = new Lesson({
    teacher,
    student: null,
    subject,
    date,
    duration: duration || 60,
    price,
    status: "available",
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
// DELETE LESSON
// ----------------------------------------
exports.deleteLessonSocket = async (id) => {
  const deleted = await Lesson.findByIdAndDelete(id);

  if (!deleted) throw new Error("Lesson not found");

  return { message: "Lesson deleted successfully" };
};


exports.getLessonsByStudentSocket = async (email) => {
  if (!email) throw new Error("Email dello studente non fornita");

  console.log("Recupero lezioni per lo studente:", email);
  const now = new Date();

  const lessons = await Lesson.find({
      student: email,
      date: { $gte: now } // solo date future
    })
    .sort({ date: 1 }); // ordina per data crescente

  console.log("Lezioni trovate:", lessons);  
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

exports.getMattersSocket = async () => {
  return [
        "Analisi",
        "Ingegneria del software",
        "OOP",
        "Basi di dati",
        "Big data",
        "Project Management",
        "PPS",
        "Algebra e Geometria",
        "Algoritmi",
        "Reti di Calcolatori",
        "Programmazione Web",
        "Sistemi Operativi",
        "Basi di Dati",
        "Machine Learning",
        "Probabilità e Statistica",
      ];
};