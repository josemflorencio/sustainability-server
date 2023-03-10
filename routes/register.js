const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/User')
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/', async (req, res) => {
    const {username, email, password} = req.body
    const registerUser = new User({
        username,
        email,
        password
    })
    try{
        const saveUser = await registerUser.save()
        res.status(201).json(registerUser)
    }catch (err){
        res.status(400).json({
            message : err.message
        })
    }
})

module.exports = router