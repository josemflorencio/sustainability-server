const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router()
const Location = require('../models/Locations')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/:id', async (req, res) => {
  console.log('route accessed')
  const locationID = req.params.id
  if (!locationID) {
    return res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry = await Location.findOne({ place_id: locationID })
    if (!entry) {
      const new_entry = new Location({
        place_id : locationID
      })
      await new_entry.save()
      return res.status(200).json({
        new_entry
      })
    }
    res.status(200).json({
      entry
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
})

router.get('/reviews/:id', async (req, res) => {
  console.log('route accessed')
  const locationID = req.params.id
  if (!locationID) {
    res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry = await Location.findOne({ place_id: locationID }).populate('reviews')
    if (!entry) {
      const new_entry = new Location({
        place_id : locationID
      })
      await new_entry.save()
      return res.status(200).json({
        reviews : []
      })
    }
    if(entry.reviews == null){
      console.log('here')
      return res.status(200).json({
        reviews : []
      })
    }
    const reviews = entry.reviews
    res.status(200).json({
      reviews
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error
    })
  }
})

/*
  *** ignore this ***
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
