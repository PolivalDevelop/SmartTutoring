// reviewController.js (versione Socket.io)

const { lessonModel } = require("../models/lessonModel");
const { reviewModel } = require("../models/reviewModel");
const { userModel } = require("../models/userModel");

// --------------------------------------------------
// CREATE REVIEW
// --------------------------------------------------
exports.createReviewSocket = async (data) => {
  const { student, teacher, score, comment } = data;

  // Controlli utente
  const userStudent = await userModel.findOne({ username: student.username });
  if (!userStudent) throw new Error("Student not found");

  const userTeacher = await userModel.findOne({ username: teacher.username });
  if (!userTeacher) throw new Error("Teacher not found");

  if (userStudent._id.equals(userTeacher._id)) {
    throw new Error("Student and teacher cannot be the same user");
  }

  // Già recensita
  const existingReview = await reviewModel.findOne({
    student: userStudent._id,
    teacher: userTeacher._id
  });

  if (existingReview) {
    throw new Error("Review already exists for this student and teacher");
  }

  // Crea nuova recensione
  const newReview = new reviewModel({
    student: userStudent.email,
    teacher: userTeacher.email,
    score,
    comment,
  });

  return await newReview.save();
};

exports.getAllUserReviewSocket = async (email) => {
  const user = await userModel.findOne({ email: email });

  if (!user) throw new Error("User not found");

  const reviews = await reviewModel.find({ teacher: user.email });

  if (!reviews || reviews.length === 0) {
    throw new Error("No reviews found for this teacher");
  }

  return reviews;
};
