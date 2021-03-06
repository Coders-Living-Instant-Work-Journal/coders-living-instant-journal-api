const User = require('../models/user')

// Authenticates that the token provided is valid
function bearerAuth (req, res, next) {
  console.log(req.headers)
  if (!req.headers.authorization) {
    next(new Error('Missing authorization header'))
  } else {
    const token = req.headers.authorization.split(' ').pop()

    User.authenticateToken(token)
      .then(validUser => {
        req.body.userId = validUser._id
        req.body.journalId = validUser.selectedJournal
        req.user = validUser
        next()
      })
      .catch(error => {
        next(error)
      })
  }
}

module.exports = bearerAuth
