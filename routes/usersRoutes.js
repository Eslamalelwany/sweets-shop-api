const express = require('express')

const router = express.Router()
const verifyToken = require('../middleware/verifyToken')


const userController = require('../controllers/usersController.js')
const whosCan = require('../middleware/whoCan.js')
const userRole = require('../utils/userRoles.js')

router.route('/api/users').get(verifyToken, whosCan(userRole.OWNER),userController.getAllUsers)

router.route('/api/v1/register').post(userController.register)

router.route('/api/v1/login').post(userController.login)

module.exports = router 
