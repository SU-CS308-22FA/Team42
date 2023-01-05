const mongoose = require('mongoose')

const friendRequestSchema = new mongoose.Schema({
    requester: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('friendRequest', friendRequestSchema)