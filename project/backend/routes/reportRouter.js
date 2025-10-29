const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');

router.route('/')
  .post(controller.createReport);

router.route('/product/:id')
  .get(controller.getReportByProductId)
  .delete(controller.deleteReport);

router.route('/user/:username')
  .get(controller.getAllUserLessonsWithReport)

module.exports = router;