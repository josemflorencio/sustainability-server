const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.use(bodyParser.urlencoded({ extended: false }))

router.post('/', async (req, res) => {
  const id_token = req.headers.authorization.split(" ")[1]
  const decoded = jwt.decode(id_token);

  const sub = decoded.sub;
  const exists = await User.findOne({sub: sub})

  if(!exists){
    const new_user = new User({
      username: decoded.nickname,
      email: decoded.email,
      sub: decoded.sub
    })
    try {
      new_user.save()
      res.json({
        message : 'Success'
      })
    } catch (error) {
      console.log(error)
    }
  }

})

module.exports = router
