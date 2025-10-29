const express = require('express');
const router = express.Router();
const controller = require('../controllers/lessonController');

router.route('/')
  .post(controller.createLesson)
  .get(controller.getAllLessons);

router.route('/product/:id')
  .get(controller.getLessonByProductId)
  .delete(controller.deleteLesson);

router.route('/lesson/materia/:materia')
    .get(controller.getAllLessonsByMateria);  

router.route('/lesson/data/:data')
    .get(controller.getAllLessonsByData);

router.route('/lesson/docente/:docente')
    .get(controller.getAllLessonsByDocente);

router.route('/lesson/studente/:studente')
    .get(controller.getAllLessonsByStudente);

router.route('/lesson/stato/:stato')
    .get(controller.getAllLessonsByStato);

router.route('/lesson/prezzo/:minPrezzo/:maxPrezzo')
    .get(controller.getAllLessonsByPrezzo);

router.route('/lesson/search')
  .get(controller.searchLessons);    

module.exports = router;