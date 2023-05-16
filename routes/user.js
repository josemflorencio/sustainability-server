const express = require('express')
const User = require('../models/User')
const Location = require('../models/Locations')
const router = express.Router()
const auth = require('../prerequesthandlers/authorization')
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/:id', auth, async (req, res) => {
  const userId = req.params.id
  const user = await User.findOne({ sub: userId })

  if (user) {
    return res.status(200).json({
      message: 'Success',
      user
    })
  } else {
    return res.status(404).json({
      message: 'User not found'
    })
  }
})

router.post('/add-favorite/:id', auth, async (req, res) => {
  try {
    const location = await Location.findOne({ place_id: req.body.place_id })
    const user = await User.findOne({ sub: req.params.id }).populate('favorites')
    console.log(await User.findOne({ favorites: location._id }))
    if (await User.findOne({ favorites: location._id })) {
      return res.status(400).json({
        message: 'Failed to Favorite - Store already favorited'
      })
    }
    await User.findOneAndUpdate({ sub: req.params.id }, { $push: { favorites: location._id } })
    return res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
  }
})

router.delete('/delete-favorite/:id', auth, async (req, res) => {
  try {
    const location = await Location.findOne({ place_id: req.query.place_id })
    const locationID = location._id
    if (!(await User.findOne({favorites: locationID}))) {
      return res.status(404).json({
        message: 'location not in favorites'
      })
    }
    await User.findOneAndUpdate({ sub: req.params.id }, { $pull: { favorites: locationID } })
    return res.status(200).json({
      message: 'Success'
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/favorites/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.params.id }).populate('favorites')
    const favorites = user.favorites
    return res.status(200).json({
      message: 'Success',
      favorites
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
