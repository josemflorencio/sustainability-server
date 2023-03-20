const jwt = require('jsonwebtoken')
const User = require('../models/User')

function authorizationMiddleware(req, res, next){
    const authToken = req.headers.authorization.split(' ')[1]
    console.log(req.headers.authorization.split(' ')[1])
    jwt.verify(authToken, process.env.SECRET, (err, decoded) => {
        if(err){
            res.status(401).json({
                message : 'INVALID TOKEN'
            })
            return
        } else {
            console.log(decoded)
        }
    })
    next()
}

module.exports = authorizationMiddleware