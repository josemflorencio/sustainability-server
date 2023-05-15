const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const Location = require('../models/Locations')
const auth = require('../prerequesthandlers/authorization')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/:id', async (req, res) => {
  const locationID = req.params.id
  console.log(req.query)
  if (!locationID) {
    return res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry = await Location.findOne({ place_id: locationID })
    if (!entry) {
      const new_entry = new Location({
        name: req.query.place_name,
        place_id: locationID
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
  const locationID = req.params.id
  if (!locationID) {
    res.status(400).json({
      message: 'MISSING REQUIRED PARAMETER'
    })
  }
  try {
    const entry = await Location.findOne({ place_id: locationID }).populate({ path: 'reviews', populate: { path: 'author_id' } })
    if (!entry) {
      const new_entry = new Location({
        name: req.query.place_name,
        place_id: locationID
      })
      await new_entry.save()
      return res.status(200).json({
        reviews: []
      })
    }
    if (entry.reviews == null) {
      return res.status(200).json({
        reviews: []
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

module.exports = router
