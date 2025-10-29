const {lessonModel} = require('../models/lessonModel')
const {reviewModel} = require('../models/reviewModel')
const {userModel} = require('../models/userModel')
const mongoose = require('mongoose')

exports.createReview = async (req, res) => {
  const {student, teacher, lesson, score, description} = req.body;
  try {
    const userStudent = await userModel.findOne({username: student.username});
    if (!userStudent) {
      return res.status(404).json({message: 'student not found'});
    }

    const userTeacher = await userModel.findOne({username: teacher.username});
    if (!userTeacher) {
      return res.status(404).json({message: 'Teacher not found'});
    }

    if (userStudent._id.equals(userTeacher._id)) {
      return res.status(400).json({message: 'student and teacher cannot be the same user'});
    }

    const referedLesson = await lessonModel.findById(lesson);
    if (!referedLesson) {
      return res.status(404).json({message: 'Lesson not found'});
    }

    if (!referedLesson.teacher.equals(userTeacher._id)) {
      return res.status(400).json({message: 'Teacher does not match the teacher of the lesson'});
    }

    if (referedLesson.student && !referedLesson.student.equals(userStudent._id)) {
      return res.status(400).json({message: 'student does not match the student of the lesson'});
    }

    const existingReview = await reviewModel.findOne({
      student: userStudent._id,
      teacher: userTeacher._id,
      lesson: referedLesson._id,
    });
    if (existingReview) {
      return res.status(400).json({message: 'Review already exists for this student, teacher, and lesson'});
    }

    const newReview = new reviewModel({
      student: userStudent._id,
      teacher: userTeacher._id,
      lesson: referedLesson._id,
      score,
      description,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error creating review', error});
  }
};

exports.getAllUserLessonsReview = (req, res) => {
  const username = req.params.username;
  userModel.find({ username: username })
    .exec()
    .then(user => {
      if (user.length > 0) {
        const userId = user[0]._id;
        return reviewModel.find({ teacher: userId }).exec();
      } else {
        res.status(404).json({ message: 'No user found' });
        throw new Error('No user'); // per interrompere la catena
      }
    })
    .then(reviews => {
      if (reviews && reviews.length > 0) {
        return lessonModel.find({ _id: { $in: reviews.map(review => review.lesson) } }).exec();
      } else {
        res.status(404).json({ message: 'No reviews found for this teacher' });
        throw new Error('No reviews');
      }
    })
    .then(posts => {
      const formattedLessons = posts.map(lesson => {
        return {
          ...lesson.toObject()
        };
      });
      res.status(200).json(formattedLessons);
    })
    .catch(err => {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error searching user reviews or posts' });
      }
      console.error(err);
    });
};