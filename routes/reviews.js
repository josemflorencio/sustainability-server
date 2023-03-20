const express = require('express')
const Review = require('../models/Review')
const Users = require('../models/User')
const auth = require('../middleware/authorization')
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.json())

router.get('/', auth, async (req, res) => {
  const userID = req.body.author_id
  try {
    const userReviews = await Users.findById(userID, 'reviews').populate('reviews')
    res.status(200).json(userReviews)
  } catch (error) {
    res.json(error)
  }
})

//STILL NEED POST REVIEW

router.delete('/delete-review/:id', async (req, res) => {
  const deleteReview = await Review.findByIdAndDelete({ _id: req.params.id })
  if (!deleteReview) {
    res.status(404).json({
      message: 'REVIEW_NOT_FOUND'
    })
  } else {
    res.status(200).json({
      message: 'REVIEW_SUCCESSFULLY_DELETED'
    })
  }
})

module.exports = router
