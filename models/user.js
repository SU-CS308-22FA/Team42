const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
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

module.exports = mongoose.model('User', userSchema)