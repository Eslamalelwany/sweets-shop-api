const productsModel = require('../model/productModel.js')
const AppError = require('../utils/appError.js')
const asyncWrapper = require('../middleware/asyncWrapper')
const orderModel = require('../model/orderModel.js')
const userRole = require('../utils/userRoles.js')





// 1- calculate the total price not take it from request   
// 2- check if the product is availble in DB or not
// 3- stock tracking


const createOrder = asyncWrapper(async(req, res, next) => {
    const productsId = req.body.products.map((item) => {
        return item.product
    })
    // console.log(productsId)
    // console.log(productsId[0].length)
    const product = await productsModel.find({_id: { $in: productsId } })

    if(productsId.length !== product.length) {
        const error = AppError.create("Products Doesnt exist", 404)
        return next(error)
    }

    // map on products that has came from DB 
    const orderProducts  = product.map((dbItem) => {
        let matchedItem = req.body.products.find((reqItem) => {
            return reqItem.product === String(dbItem._id)
        })
        return {product:dbItem._id , priceAtOrder: dbItem.price , quantity: matchedItem.quantity}
    })

    let totalPrice = orderProducts.reduce((acc, curr) => {
        let result  = acc + (curr.priceAtOrder * curr.quantity)
        return result
    },  0)

    const newOrder = await orderModel.create({user: req.currentUser.id , products :orderProducts  , totalPrice, shippingAddress: req.body.shippingAddress})

    res.status(201).json({ status: 'success', data: newOrder });
})


const getMyOrder = asyncWrapper(async(req, res, next) => {
    const userId = req.currentUser.id   
    const orders = await orderModel.find({user: userId})
    res.json({orders})
})






const getOrderWithId = asyncWrapper(async(req, res, next) => {
    const orderId = req.params.Id 

    const orderFromDb = await orderModel.findById(orderId)
    
    if (!orderFromDb)  {
        const error = AppError.create("This order has not been found", 404)
        return next(error)
    }

    const currentUserId = req.currentUser.id
    let isOwner = req.currentUser.role === userRole.OWNER 

    // TODO: => owner can see any order 
    if (currentUserId !== orderFromDb.user.toString() && !isOwner) {
        const error = AppError.create("Not Found", 404)
        return next(error)
    } 

    res.json({id: orderFromDb})

})


const updateOrderStatus = async(req, res, next) => {
    const orderId = req.params.Id 
    const findOrderInDb = await orderModel.findById(orderId)

    if(!findOrderInDb) {
        const error = AppError.create("Order Not Found", 404)
        return next(error)
    }
    
    const allowedStatus = orderModel.schema.path('status').enumValues
    if(!allowedStatus.includes(req.body.status)) {
        const error = AppError.create("Invalid Status", 404)
        return next(error)
    }
    const changeOrderState  = await orderModel.findByIdAndUpdate(orderId, {status: req.body.status},{ new: true })
    
    res.json({order: changeOrderState})
}


const cancelOrder = asyncWrapper(async(req, res, next) => {
    const cancelledOrderId = req.params.Id

    const searchForOrderInDb = await orderModel.findById(cancelledOrderId)


    if(!searchForOrderInDb) {
        const error = AppError.create("Order Not Found", 404)

        return next(error)
    }

    let userId =  req.currentUser.id
    
    console.log(searchForOrderInDb.user.toString())

    if (userId !== searchForOrderInDb.user.toString()) {
        const error = AppError.create("Order Not Found", 404)
        return next(error)
    }
    const updateOrder = await orderModel.findByIdAndUpdate(cancelledOrderId, {status: 'cancelled'}, { new: true })

    res.json({ updateOrder })
})


const getAllOrders = asyncWrapper(async(req, res, next) => {
    const getOrdersFromDb = await orderModel.find() 
    res.json({orders: getOrdersFromDb})
})



module.exports = {
    createOrder,
    getMyOrder,
    getOrderWithId,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
}

