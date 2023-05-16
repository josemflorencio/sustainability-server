const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const JwksRsa = require('jwks-rsa')

router.use(bodyParser.urlencoded({ extended: false }))

const jwksClient = JwksRsa({
  jwksUri: 'https://dev-ubcl3tm5kmtrgusg.us.auth0.com/.well-known/jwks.json'
})

async function auth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'ERROR: must have authorization header'
    })
  }
  const id_token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(id_token, { complete: true })

  try {
    const signingKey = await jwksClient.getSigningKey(decoded.header.kid)
    jwt.verify(id_token, signingKey.getPublicKey(), {
      algorithms: ['RS256']
    })
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
  next()
}

module.exports = auth
