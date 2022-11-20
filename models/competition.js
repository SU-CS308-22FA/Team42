const mongoose = require('mongoose')

const competitionSchema = new mongoose.Schema({
    competition_id: {
        type: Number,
        required: true,
        unique: true
    },
    season_id: {
        type: Number,
        required: true,
        default: 0
    },
    competition_name: {
        type: String,
        required: false
    },
    competition_gender: {
        type: String,
        required: true
    },
    competition_youth: {
        type: Boolean,
        default: false,
        required: true
    },
    season_name: {
        type: String,
        required: true
    },
    competition_start: {
        type: Date,
        required: true
    },
    competition_end: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    modified_at: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Competition', competitionSchema)