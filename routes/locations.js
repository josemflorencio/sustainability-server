const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const Location = require('../models/Locations')

router.use(bodyParser.json())

/*
    /locations/{id}
    reponse: a location document
*/
router.get('/:id', async (req, res) => {
  const locationID = req.params.id
  if (!locationID) {
    res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry = await Location.findById(locationID)
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
    console.error(error)
    res.status(500).json({
      message: error
    })
  }
})

router.get('/:id/reviews')

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
