const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    team_id : {
        type: Number,
        required: false,
        default: 0
    },
    team_name : {
        type: String,
        required: true,
    },
    lineup : [ {
        user_id : String,
        player_name : String,
        player_nickname : String,
        jersey_number : Number,
        country : {
            id : Number,
            name : String
        },
        cards : [{
            time : String,
            card_type : String,
            reason : String,
            period : Number 
        }],
        positions : [{
            position_id : Number,
            position : String,
            from : String,
            to : String,
            from_period : Number,
            to_period : Number,
            start_reason : String,
            end_reason : String
        }],
        owner: {
            type: Boolean,
            default: false,
            required: true,
        }
    },],
    created_at: {
        type: Date,
        required: true
    },
    modified_at: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Team', teamSchema)