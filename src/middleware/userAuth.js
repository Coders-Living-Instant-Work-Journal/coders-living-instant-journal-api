const base64 = require('base-64')
const User = require('../models/user')

function userAuth (req, res, next) {
  if (!req.headers.authorization) {
    next(new Error('Missing authorization header'))
  } else {
    const user = req.headers.authorization.split(' ').pop()
    const decoded = base64.decode(user)
    const [email, pass] = decoded.split(':')
    return User.authenticateUser(email, pass)
      .then(validate)
  }
  function validate (email) {
    if (email) {
      req.email = email
      req.token = email.generateToken()
      next()
    } else {
      next(new Error('User email or password is incorrect.'))
    }
  }
}

module.exports = userAuth