const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.use(bodyParser.urlencoded({extended:false}))

router.post('/', async (req, res) => {
    const {email, password} = req.body

    if(!email){
        return res.status(400).json({
            message : 'EMAIL REQUIRED'
        })
    }

    const user = await User.findOne({email : email})
    if(!user){
        res.status(404).json({
            message : 'USER NOT FOUND'
        })
        return
    }

    const compare_password = await bcrypt.compare(password, user.password)

    if(!compare_password){
        res.status(401).json({
            message : 'INVALID PASSWORD'
        })
        return
    }

    const token = jwt.sign({id : user._id}, process.env.SECRET, {expiresIn: '12h'})

    res.status(200).json({
        access_token : token
    })
})

module.exports = router