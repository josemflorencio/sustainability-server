const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const Location = require('../models/Locations')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:true}))

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
    const entry = await Location.find({place_id : locationID})
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

router.get('/:id/reviews', async (req, res) => {
  const locationID = req.params.id
  if(!locationID){
    res.status(400).json({
      message : 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry =  await Location.find({place_id : locationID})
    const entry_reviews = entry.reviews
    if(!entry){
      res.status(400).json({
        message : `LOCATION WITH ID: ${locationID} NOT FOUND`
      })
    } else {
      res.status(200).json({
        entry_reviews
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message : error
    })
  }
})

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
