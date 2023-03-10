const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true
    },
    password: {
        type: String, 
        required: true,
        select: false
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review'}]
})

const User = mongoose.model('User', UserSchema)

module.exports = User