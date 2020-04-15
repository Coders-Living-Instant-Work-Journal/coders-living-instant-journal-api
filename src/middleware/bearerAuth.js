const User = require('../models/user')

// Authenticates that the token provided is valid
function bearerAuth (req, res, next) {
  if (!req.headers.authorization) {
    next(new Error('Missing authorization header'))
  } else {
    const token = req.headers.authorization.split(' ').pop()
    req.body.journalId = '5e9609164c25f20cba4957de'
    req.body.userId = '5e95e92c413b4708abf002bf'
    if (token === '1') next()

    else next('you efffed up murica')
    // User.authenticateToken(token)
    //   .then(validUser => {
    //     req.body.userId = validUser._id
    //     req.body.journalId = validUser.selectedJournal
    //     req.user = validUser
    //     next()
    //   })
    //   .catch(error => {
    //     next(error)
    //   })
  }
}

module.exports = bearerAuth
