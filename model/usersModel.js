const mongoose = require('mongoose');
const userRole = require('../utils/userRoles')



const userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true }, // مهم أكتر من الإيميل هنا
        email: { type: String },
        password: { type: String, required: true, select: false },
        role: { type: String , enum: [userRole.OWNER , userRole.COUSTOMER], default: userRole.COUSTOMER },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);