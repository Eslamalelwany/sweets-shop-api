const jwt = require('jsonwebtoken')

const AppError = require('../utils/appError')




const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if(!authHeader) {
        return next(AppError.create('Unauthorized', 401, 'Failed'))
    }
    const token = authHeader.split(' ')[1]

    try {
        const currentUser = jwt.verify(token, process.env.SECRET_KEY )
        req.currentUser = currentUser
        next()
    }
    catch(err) {
        err =  AppError.create("Invalid Token", 401, "Error")
        return next(err)
    }
}

module.exports = verifyToken 