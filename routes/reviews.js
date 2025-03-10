const express = require('express')
const User = require('../models/User')
const Review = require('../models/Review')
const Location = require('../models/Locations')
const router = express.Router()
const auth = require('../prerequesthandlers/authorization')

const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

/*
submit review endpoint
must pass auth middleware before handling request
*/
router.post('/submit-review', auth, async (req, res) => {
  // extracting paramters from request body
  const { place_id, user_id, rating, review } = req.body

  // if parameters are missing, the endpoint returns status 400
  if (!place_id || !rating || !review || !user_id) {
    return res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }

  const user_query = await User.findOne({ sub: user_id })
  const author_id = user_query._id

  if (await Review.findOne({ place_id, author_id })) {
    return res.status(403).json({
      message: 'REVIEW POST LIMIT EXCEEDED'
    })
  }

  console.log(author_id)

  if (!place_id || !rating || !review || !user_id) {
    return res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }

  try {
    const new_review = new Review({
      place_id,
      author_id,
      rating,
      review
    })

    if (!await Location.findOne({ place_id })) {
      const new_location = new Location({
        place_id
      })
      await new_location.save()
    }

    const saved_review = await new_review.save()
    const update_location = await Location.findOneAndUpdate({ place_id }, { $push: { reviews: saved_review._id } })
    const update_user = await User.findOneAndUpdate({ _id: author_id }, { $push: { reviews: saved_review._id } })
    return res.status(200).json({
      message: 'REVIEW CREATED'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error
    })
  }
})

router.delete('/delete-review/:id', auth, async (req, res) => {
  console.log(req.params.id)
  const entry = await Review.findById(req.params.id)
  if (!entry) {
    return res.status(404).json({
      message: 'Review not found'
    })
  }
  const { author_id, place_id } = entry
  console.log(place_id)
  try {
    await Review.findByIdAndDelete(req.params.id)
    await Location.findOneAndUpdate({ place_id: place_id }, { $pull: { reviews: req.params.id } })
    await User.findByIdAndUpdate(author_id, { $pull: { reviews: req.params.id } })
    return res.status(200).json({message: 'Review deleted'})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
