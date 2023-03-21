const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.use(bodyParser.urlencoded({ extended: false }))

/*
    POST METHOD
    PARAMETERS:
        REQUEST BODY MUST CONTAIN
        {
            email: ****,
            password: ****
        }

    RESPONSES:

        FAILURE RESPONSES
        {
            message : 'EMAIL REQUIRED' (missing parameter)
        }
        {
            message : 'USER NOT FOUND' (user does not exist in database)
        }
        {
            message : 'INVALID PASSWORD' (password does not match hashed password)
        }

        SUCESS RESPONSE
        {
            access_token : token
        }

        notes:
            after successful login, access token must be passed to backend
            for protected endpoints in authorization header
            example:
                authorization : Bearer {token}
            as of now, tokens expire after 12 hours, client must be redirected
            to login page for a new token.
*/
router.post('/', async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'EMAIL REQUIRED'
    })
  }

  const user = await User.findOne({ email })
  if (!user) {
    res.status(404).json({
      message: 'USER NOT FOUND'
    })
    return
  }

  const comparePassword = await bcrypt.compare(password, user.password)

  if (!comparePassword) {
    res.status(401).json({
      message: 'INVALID PASSWORD'
    })
    return
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '12h' })

  res.status(200).json({
    access_token: token
  })
})

module.exports = router
