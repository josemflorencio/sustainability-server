const mongoose = require('mongoose')

/*
    USER SCHEMA
    {
        username: ""
        email: ""
        password: ""
        reviews: []
    }
*/
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
  sub: {
    type: String,
    required: true,
    unique: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
})

const User = mongoose.model('User', UserSchema)

module.exports = User
