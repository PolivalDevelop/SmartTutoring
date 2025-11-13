const express = require('express');
const router = express.Router();
const controller = require('../controllers/lessonController');

// Create a new lesson or get all lessons
router.route('/')
  .post(controller.createLesson)
  .get(controller.getAllLessons);

// Get or delete a lesson by ID
router.route('/lesson/:id')
  .get(controller.getLessonById)
  .delete(controller.deleteLesson);

// Get lessons filtered by subject
router.route('/lesson/subject/:subject')
  .get(controller.getLessonsBySubject);

// Get lessons filtered by date
router.route('/lesson/date/:date')
  .get(controller.getLessonsByDate);

// Get lessons filtered by teacher (docente)
router.route('/lesson/teacher/:teacher')
  .get(controller.getLessonsByTeacher);

// Get lessons filtered by student
router.route('/lesson/student/:student')
  .get(controller.getLessonsByStudent);

// Get lessons filtered by status (free, booked, completed)
router.route('/lesson/status/:status')
  .get(controller.getLessonsByStatus);

// Get lessons filtered by price range
router.route('/lesson/price/:minPrice/:maxPrice')
  .get(controller.getLessonsByPriceRange);

// Composite/advanced search (multiple filters)
router.route('/lesson/search')
  .get(controller.searchLessons);

module.exports = router;
