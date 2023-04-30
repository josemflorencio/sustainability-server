const mongoose = require('mongoose')

/*
REVIEWS SCHEMA
{
    author_id: ""
    rating: Number
    review: ""
}
*/
const reviewSchema = new mongoose.Schema({
  place_id: {
    type: String,
    required: true,
    ref: 'Location'
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number
  },
  review: {
    type: String,
    maxlength: 1000
  }
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
