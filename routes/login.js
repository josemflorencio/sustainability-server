const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.use(bodyParser.urlencoded({ extended: false }))

router.post('/', async (req, res) => {
  if (!req.headers.authorization) {
    return res.json({
      message: 'ERROR: must have authorization header'
    })
  }
  const id_token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(id_token, { complete: true })

  const sub = decoded.payload.sub
  const exists = await User.findOne({ sub })

  if (!exists) {
    const new_user = new User({
      username: decoded.payload.nickname,
      email: decoded.payload.email,
      sub: decoded.payload.sub
    })
    try {
      new_user.save()
      return res.json({
        message: 'Success'
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    return res.json({ message: 'SUCCESS' })
  }
})

module.exports = router
