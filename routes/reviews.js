const express = require('express')
const Review = require('../models/Review')
const Users = require('../models/User')
const Location = require('../models/Locations')
const auth = require('../middleware/authorization')
const router = express.Router()

const bodyParser = require('body-parser')
const { $where } = require('../models/User')
router.use(bodyParser.json())

/*
  ENDPOINT FOR SUBMITTING AND STORING REVIEWS
  USAGE : 
      BODY PARAMETERS:
          {
            place_id : [REQUIRED],
            rating : [REQUIRED],
            review : [REQUIRED]
          }
      response :
          {
            message : 'REVIEW CREATED'
          }
  notes: 
          auth token required to be passed by header to api, 
          response will return invalid token message otherwise
*/
router.post('/submit-review', auth, async (req, res) => {
  const {place_id, rating, review} = req.body
  const author_id = res.locals.userid

  if(!place_id || !rating || !review){
    res.status(400).json({
      message : 'MISSING REQUIRED PARAMETER'
    })
  }

  try {
    const new_review = new Review({
      location : place_id,
      author_id : author_id,
      rating : rating,
      review : review
    })
    await new_review.save()
    await Location.findOneAndUpdate({place_id : place_id}, {$push: {reviews: new_review._id}})
    res.status(200).json({
      message : 'REVIEW CREATED'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message : error
    })
  }
})

/*
  ENDPOINT FOR DELETING REVIEWS
  USAGE :
      PATH : /delete-review/{id}
      looks for review with specified id
  notes :
      protected endpoint, auth token required to be passed by header
*/
router.delete('/delete-review/:id',auth, async (req, res) => {
  const deleteReview = await Review.findByIdAndDelete({ _id: req.params.id })
  if (!deleteReview) {
    res.status(404).json({
      message: 'REVIEW NOT FOUND'
    })
  } else {
    res.status(200).json({
      message: 'REVIEW SUCCESSFULLY DELETED'
    })
  }
})

module.exports = router
