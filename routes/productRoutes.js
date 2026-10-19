const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const whosCan = require('../middleware/whoCan')

const userRole = require('../utils/userRoles')
const router = express.Router()
const userController = require('../controllers/productControl')


router.route('/api/products')
                            .get(userController.getAllProducts)
                            .post(verifyToken, whosCan(userRole.OWNER), userController.createProduct)

router.route('/api/products/:ID')
                                .get(userController.getSingleProduct)
                                .patch(verifyToken, whosCan(userRole.OWNER), userController.updateProduct)
                                .delete(verifyToken, whosCan(userRole.OWNER), userController.deleteProduct)

module.exports = router
