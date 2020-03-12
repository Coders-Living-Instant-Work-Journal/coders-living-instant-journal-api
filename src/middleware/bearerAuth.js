const User = require('../models/user')

function bearerAuth (req, res, next) {
  if (!req.headers.authorization) {
    next(new Error('Missing authorization header'))
  } else {
    const token = req.headers.authorization.split(' ').pop()

    User.authenticateToken(token)
      .then(validUser => {
        req.body.userId = validUser._id
        req.user = validUser
        next()
      })
      .catch(error => {
        next(error)
      })
  }
}

module.exports = bearerAuth
