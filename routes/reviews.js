const express = require('express')
const Review = require('../models/Review')
const Location = require('../models/Locations')
const router = express.Router()

const bodyParser = require('body-parser')
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

          if the place_id is not found in the database, a new document is created
          using the place_id and the review is successfully added to it
*/
router.post('/submit-review', async (req, res) => {
  const { place_id, rating, review } = req.body
  const author_id = res.locals.userid

  if (!place_id || !rating || !review) {
    res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }

  try {
    const new_review = new Review({
      location: place_id,
      author_id,
      rating,
      review
    })

    if (!await Location.findOne({ place_id })) {
      const new_location = new Location({
        place_id
      })
      console.log('hello')
      await new_location.save()
    }

    await new_review.save()
    const update_location = await Location.findOneAndUpdate({ place_id }, { $push: { reviews: new_review._id } })
    res.status(200).json({
      message: 'REVIEW CREATED'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error
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
router.delete('/delete-review/:id', async (req, res) => {
  try {
    const entry = await Review.findByIdAndDelete({ _id: req.params.id })
    if (!entry) {
      res.status(404).json({
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
