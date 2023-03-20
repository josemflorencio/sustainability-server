const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.post('/', async (req, res) => {
  const user = await User.findOne({email : req.body.email})
  if(user){
    res.status(409).json({
      message : 'EMAIL ALREADY EXISTS'
    })
    return
  }

  const salt_rounds = 10
  const hash_password = await bcrypt.hash(req.body.password, salt_rounds)

  const newUser = new User({
    username : req.body.username,
    email : req.body.email,
    password : hash_password
  })

  try {
    await newUser.save()
    res.status(201).json({
      message : 'NEW USER SUCCESSFULLY CREATED'
    })
  } catch (error) {
    res.status(500).json({
      message : error
    })
  }
})

module.exports = router
