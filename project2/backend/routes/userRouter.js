const express = require('express')
const controller = require('../controllers/userController')

module.exports = function(jwtSettings) {
  const router = express.Router()

  router.route('/')
    // .get(controller.getAllUsers)
    .post(controller.createUser)

  router.route('/session')
    .get(controller.getSessionData)

  router.route('/session/login')
    .post((req, res) => controller.loginUser(req, res, jwtSettings))

  router.route('/session/logout')
    .post(controller.logoutUser)

  router.route('/:username')
    .get(controller.searchByUsername)
    .delete(controller.deleteUser)

  router.route('/id/:id')
    .get(controller.searchById)

  return router
}