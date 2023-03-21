const jwt = require('jsonwebtoken')

/*
    Middleware function for checking tokens sent from client
*/
function authorizationMiddleware (req, res, next) {
  const authToken = req.headers.authorization.split(' ')[1]
  jwt.verify(authToken, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID TOKEN'
      })
    } else {
      res.locals.userid = decoded.id
      next()
    }
  })
}

module.exports = authorizationMiddleware
