


const userSchema = require('../model/usersModel')
const bcrypt = require('bcrypt')
const asyncWrapper = require('../middleware/asyncWrapper')
const AppError = require('../utils/appError')
const generateWebToken = require('../utils/generateWebToken')


const getAllUsers = asyncWrapper(async(req, res) => {
    const users = await userSchema.find()
    res.status(200).json({ data: { users } })
})


const register = asyncWrapper(async(req, res, next) => {
    const {name, phone, email, password, role} = req.body 

    //  check User 
    const existingUser = await userSchema.findOne({$or: [{ email }, { phone }] })
    if(existingUser) {
        return next(AppError.create('Email or phone has already existed', 400))
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)

const newUser = new userSchema({
    name,
    phone,
    email,
    password: hashedPassword,
    role,
})

    await newUser.save() 


    const generateToken =  generateWebToken({email: newUser.email, id: newUser._id, role: newUser.role})
    console.log("Token=> ",generateToken)


    // dont return the password in the reponse 
    newUser.password = undefined

    res.status(200).json({data:newUser})
})


const login = asyncWrapper(async(req, res, next) => {
    const {phone, password} = req.body 
    if(!phone & !password ) {
        const error = AppError.create('Phone and Password are required', 404, "Error")
        return next(error)
    }

    let user = await userSchema.findOne({phone}).select('+password')
    console.log("{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}")
    console.log(user.password)
    
    
    if(!user) {
        const error = AppError.create('User does not exist', 404, "Error")
        return next(error)
    } 
    
    const matchedPassword = await bcrypt.compare(password, user.password)
    
    if(user && matchedPassword) {
        const token = generateWebToken({email: user.email, id: user._id, role: user.role})
        console.log(token)
        return res.status(200).json({message: "logged in successfully"})
    }else {
        const error = AppError.create('Falied to Login', 404, "Error")
        next(error)
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}