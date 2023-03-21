const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

/*
  REGISTER ENDPOINT
  REGISTERS A NEW USER

  PARAMETERS:
    REQUEST BODY MUST CONTAIN :
      {
        username: ****,
        email: ****,
        password: ****
      }
  RESPONSES:
    FAILURE RESPONSES
    {
      message : 'EMAIL ALREADY EXISTS
    }

    SUCCESS RESPONSES
    {
      message : 'NEW USER SUCCESSFULLY CREATED'
    }

*/
router.post('/', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    res.status(400).json({
      message: 'EMAIL ALREADY EXISTS'
    })
    return
  }

  const saltRounds = 10
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds)

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword
  })

  try {
    await newUser.save()
    res.status(201).json({
      message: 'NEW USER SUCCESSFULLY CREATED'
    })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
})

module.exports = router
