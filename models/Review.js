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
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: false,
    maxlength: 500
  }
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
