const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    admin_login: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    modified_at: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Admin', adminSchema)