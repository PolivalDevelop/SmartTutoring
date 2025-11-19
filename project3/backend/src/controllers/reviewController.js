// reviewController.js (versione Socket.io)

const { lessonModel } = require("../models/lessonModel");
const { reviewModel } = require("../models/reviewModel");
const { userModel } = require("../models/userModel");

// --------------------------------------------------
// CREATE REVIEW
// --------------------------------------------------
exports.createReviewSocket = async (data) => {
  const { student, teacher, lesson, score, description } = data;

  // Controlli utente
  const userStudent = await userModel.findOne({ username: student.username });
  if (!userStudent) throw new Error("Student not found");

  const userTeacher = await userModel.findOne({ username: teacher.username });
  if (!userTeacher) throw new Error("Teacher not found");

  if (userStudent._id.equals(userTeacher._id)) {
    throw new Error("Student and teacher cannot be the same user");
  }

  // Controllo lezione
  const referencedLesson = await lessonModel.findById(lesson);
  if (!referencedLesson) throw new Error("Lesson not found");

  if (!referencedLesson.teacher.equals(userTeacher._id)) {
    throw new Error("Teacher does not match the teacher of the lesson");
  }

  if (referencedLesson.student && !referencedLesson.student.equals(userStudent._id)) {
    throw new Error("Student does not match the student of the lesson");
  }

  // Già recensita
  const existingReview = await reviewModel.findOne({
    student: userStudent._id,
    teacher: userTeacher._id,
    lesson: referencedLesson._id,
  });

  if (existingReview) {
    throw new Error("Review already exists for this student, teacher, and lesson");
  }

  // Crea nuova recensione
  const newReview = new reviewModel({
    student: userStudent._id,
    teacher: userTeacher._id,
    lesson: referencedLesson._id,
    score,
    description,
  });

  return await newReview.save();
};

// --------------------------------------------------
// GET ALL REVIEWS FOR LESSONS OF A TEACHER
// --------------------------------------------------
exports.getAllUserLessonsReviewSocket = async (username) => {
  const user = await userModel.findOne({ username });

  if (!user) throw new Error("User not found");

  // Recensioni ricevute dal docente
  const reviews = await reviewModel.find({ teacher: user._id });

  if (!reviews || reviews.length === 0) {
    throw new Error("No reviews found for this teacher");
  }

  // Trovo tutte le lezioni recensite
  const lessons = await lessonModel.find({
    _id: { $in: reviews.map((review) => review.lesson) },
  });

  if (!lessons || lessons.length === 0) {
    throw new Error("No lessons found");
  }

  return lessons.map((lesson) => lesson.toObject());
};
