
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description: String,
    images:[String],
    category: String, // e.g. 'cakes', 'cookies', 'chocolates'

    pricingType:{
        type:String,
        enum:['perKg', 'perPiece', 'fixed'],
        required:true,
    },

    price:{type:Number, required:true}, // سعر الكيلو أو القطعة أو الثابت

    customizable:{type:Boolean, default:false}, 
    customizationOptions:{  
        allowText:{type:Boolean, default:false},  // كتابة على التورتة
        faillings:[String], // خيارات الحشو المتاحة
        extraChanges:[{name:String, price:Number}]  // إضافات بسعر
    },

    isAvailable: {type:Boolean, default: true} ,
    
}, { timestamps: true })



module.exports = mongoose.model('Product', productSchema);