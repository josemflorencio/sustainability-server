const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const Location = require('../models/Locations')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

/*
    GET METHOD
    PARAMETERS:
      /{id} <-- place_id

    RESPONSES:
      FAILURE RESPONSES:
        {
          message : 'MISSING REQUIRED PARAMETERS' (id is missing)
        }
        {
          message : `LOCATION WITH ID: ${locationID} NOT FOUND`
        }

      SUCESS RESPONSES:
        {
          entry : {
            _id : (database id)
            name : "" (only if applicable, may be undefined)
            place_id : ""
            address : "" (if appicable, may be undefined)
            reviews : [] (Array)
            __v : (Number)
          }
        }
      notes :
        this api call does not populate the reviews array, and will only
        return the review IDs.
        To get reviews use the GET /:id/reviews endpoint
*/
router.get('/:id', async (req, res) => {
  const locationID = req.params.id
  if (!locationID) {
    res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry = await Location.findOne({ place_id: locationID })
    if (!entry) {
      res.status(400).json({
        message: `LOCATION WITH ID: ${locationID} NOT FOUND`
      })
    } else {
      res.status(200).json({
        entry
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
})

/*
  GET METHOD
  PARAMETERS:
    ID <-- place_id

  RESPONSES:
    FAILURE RESPONSES:
      {
        message : 'MISSING REQUIRED PARAMETERS' (id is missing)
      }
      {
        message : `LOCATION WITH ID: ${locationID} NOT FOUND`
      }
    SUCESS RESPONSES:
    {
      _id: (database id),
      location: "<place_id>",
      author_id: {},
      rating: Number,
      createdAt: <timestamp>,
      updatedAt: <timestamp>,
      __v: Number
    }
    notes:
      the "author_id" field will be populated with the authors information
      such as email and username

      reviews array will be null if the location has no stored reviews in
      the database
*/
router.get('/:id/reviews', async (req, res) => {
  const locationID = req.params.id
  if (!locationID) {
    res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry = await Location.findOne({ place_id: locationID }).populate({
      path: 'reviews',
      populate: { path: 'author_id' }
    })
    const reviews = entry.reviews
    if (!entry) {
      res.status(400).json({
        message: `LOCATION WITH ID: ${locationID} NOT FOUND`
      })
    } else {
      res.status(200).json({
        reviews
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
})

/*
  POST METHOD
  this is a temporary endpoint for saving new entries into the database from the client
  *** used for testing ***
*/
router.post('/location', async (req, res) => {
  const placeID = req.body.place_id
  const newLocation = new Location({
    placeID
  })
  try {
    await newLocation.save()
    res.status(201).json({
      message: 'LOCATION CREATED'
    })
  } catch (error) {
    res.json({
      message: error
    })
  }
})

module.exports = router
