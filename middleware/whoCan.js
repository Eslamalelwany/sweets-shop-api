const AppError = require("../utils/appError")



const whosCan = (...roles) => {
    const allowedRoles = roles
    
    return (req, res, next) => {
        let currentUser = req.currentUser.role

        if(allowedRoles.includes(currentUser)) {
            next()
        } else {
            const error = AppError.create("Access denied.", 403)
            next(error)
        }
    }
}


module.exports  = whosCan