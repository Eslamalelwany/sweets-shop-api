const productsModel = require('../model/productModel.js')

const asyncWrapper = require('../middleware/asyncWrapper')




const getAllProducts = asyncWrapper(async(req, res) => {
    const products = await productsModel.find()
    res.status(200).json({data:products})
})


const getSingleProduct = asyncWrapper(async(req, res, next) => {
    // console.log(req.params.ID)
    const singleProduct = await productsModel.findById(req.params.ID)
    if(!singleProduct) {
        return res.status(401).json({message:"Not Found"})
    }
    res.status(200).json(singleProduct);
})


const createProduct = asyncWrapper(async(req, res) => {
    let createdProduct = await productsModel.create(req.body)
    console.log(createdProduct)
    res.status(200).json({data:createdProduct})
})


const updateProduct = asyncWrapper(async(req, res) => {
    let updatedProduct = await productsModel.findByIdAndUpdate(req.params.ID, req.body ,{new:true})
    res.status(200).json({data:updatedProduct})
})

const deleteProduct = asyncWrapper(async(req, res) => {
    let deletedProduct = await productsModel.deleteOne({_id: req.params.ID})
    res.status(200).json({message:'successfully deleted'})
})


module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}