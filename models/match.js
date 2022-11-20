const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
    match_id: {
        type: Integer,
        required: true,
        unique: true
    },
    competition: {
        event_id: {
            type: Integer,
            required: true,
            unique: true
        },
        competition_name: {
            type: String,
            required: false
        }
    },
    season: {
        season_id: {
            type: Integer,
            required: true,
            default: 0,
        },
        season_name: {
            type: String,
            required: true
        },
    },
    match_start: {
        type: Date,
        required: true
    },
    match_end: {
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

module.exports = mongoose.model('Match', matchSchema)