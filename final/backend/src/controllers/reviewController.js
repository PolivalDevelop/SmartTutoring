// reviewController.js (versione Socket.io)

const Review  = require("../models/reviewModel");
const User = require("../models/userModel") 

// --------------------------------------------------
// CREATE REVIEW
// --------------------------------------------------
exports.createReviewSocket = async (data) => {
  const { student, teacher, rating, comment } = data;

  // Controlli utente
  const userStudent = await User.findOne({ email: student });
  if (!userStudent) throw new Error("Student not found");

  const userTeacher = await User.findOne({ email: teacher });
  if (!userTeacher) throw new Error("Teacher not found");

  if (userStudent._id.equals(userTeacher._id)) {
    throw new Error("Student and teacher cannot be the same user");
  }

  // Già recensita
  const existingReview = await Review.findOne({
    student: userStudent._id,
    teacher: userTeacher._id
  });

  if (existingReview) {
    throw new Error("Review already exists for this student and teacher");
  }

  // Crea nuova recensione
  const newReview = new Review({
    student: userStudent.email,
    teacher: userTeacher.email,
    rating: rating,
    comment,
  });

  return await newReview.save();
};

exports.getAllUserReviewSocket = async (email) => {
  const user = await User.findOne({ email: email });

  if (!user) throw new Error("User not found");

  const reviews = await Review.find({ teacher: email });

  if (!reviews || reviews.length === 0) {
    throw new Error("No reviews found for this teacher");
  }

  return reviews;
};
