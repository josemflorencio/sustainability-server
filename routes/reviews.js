const express = require('express')
const User = require('../models/User')
const Review = require('../models/Review')
const Location = require('../models/Locations')
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.json())

router.post('/submit-review', async (req, res) => {
  const { place_id, user_id, rating, review } = req.body

  const user_query = await User.findOne({sub: user_id})
  const author_id = user_query._id

  console.log(author_id)

  if (!place_id || !rating || !review) {
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

    await new_review.save()
    const update_location = await Location.findOneAndUpdate({ place_id }, { $push: { reviews: new_review._id } })
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

router.delete('/delete-review/:id', async (req, res) => {
  try {
    const entry = await Review.findByIdAndDelete({ _id: req.params.id })
    if (!entry) {
      return res.status(404).json({
        message: 'ENTRY NOT FOUND'
      })
    }
    console.log(entry)
    const update_location = await Location.findOneAndUpdate({ place_id: entry.location }, { $pull: { reviews: req.params.id } })
    console.log(update_location)
    res.status(200).json({
      message: 'REVIEW DELETED'
    })
  } catch (error) {
    res.status(500).json({
      message: 'SERVER ERROR'
    })
  }
})

module.exports = router
