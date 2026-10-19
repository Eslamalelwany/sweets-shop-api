const express = require('express')

const app = express()
const productsRoute = require('./routes/productRoutes')
const mongoose = require('mongoose')
const usersRoute = require('./routes/usersRoutes')
const orderRoute = require('./routes/orderRoutes')

const dotEnv = require('dotenv').config()

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('mogoose server started')
})



app.use(express.json())

app.use('/', productsRoute)
app.use('/', usersRoute)
app.use('/', orderRoute)

// app.use((err, req, res, next) => {
//     console.log(err.message)
//     res.status(400).json({ err })
// })

app.use((err, req, res, next) => {

    if (err.name === 'CastError') {
        err.statusCode = err.statusCode || 404;
        err.statusText = err.statusText || 'failed';
        err.message = 'Invalid ID format';

    }
    err.statusCode = err.statusCode || 500;
    err.statusText = err.statusText || 'error';


    res.status(err.statusCode).json({
        status: err.statusText,
        message: err.message,
    });
});

app.use("/*splat", (req, res, next) => {
    return res.status(404).json({message: "This resource is not found"})
})

app.listen(3000, () => {
    console.log("the server is listening now")
})