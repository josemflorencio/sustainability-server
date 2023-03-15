const mongoose = require('mongoose')

/*
LOCATION SCHEMA
{
    name:""
    place_id:""
    address:""
    rating: Number
    reviews: []
}
*/
const locationSchema = new mongoose.Schema({
  name: {
    type: String
  },
  place_id: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  rating: {
    type: Number
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
})

const Location = mongoose.model('Location', locationSchema)
module.exports = Location
