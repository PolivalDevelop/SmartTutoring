const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewController');

router.route('/')
  .post(controller.createReview);

router.route('/user/:username')
  .get(controller.getAllUserLessonsReview)

module.exports = router;