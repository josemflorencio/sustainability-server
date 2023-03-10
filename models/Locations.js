const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    place_id: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

const Location = mongoose.model('Location', locationSchema)
module.exports = Location