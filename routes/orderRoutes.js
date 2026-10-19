const express = require('express')

const router = express.Router()
const orderController = require('../controllers/orderController')
const verifyToken = require('../middleware/verifyToken')
const whosCan = require('../middleware/whoCan')
const userRole = require('../utils/userRoles')


router.route('/api/v1/create-order').post(verifyToken, orderController.createOrder)

router.route('/api/v1/orders/my-orders').get(verifyToken, orderController.getMyOrder)

router.route('/api/v1/orders/all-orders').get(verifyToken, whosCan(userRole.OWNER), orderController.getAllOrders)


router.route('/api/v1/orders/:Id')
                                .get(verifyToken, orderController.getOrderWithId)
                                .patch(verifyToken, whosCan(userRole.OWNER), orderController.updateOrderStatus)

router.route('/api/v1/orders/cancel/:Id').patch(verifyToken,orderController.cancelOrder) 


module.exports = router