// dependecies
const express = require('express')
const userRouter = express.Router()

const User = require('../models/user')
const userAuth = require('../middleware/userAuth')

// Takes in the request body and constructs a new User instance
// Stores that user instance to the user collection
// Then an access token is generated and returned to the client
userRouter.post('/signup', async (req, res, next) => {
  const user = new User(req.body)
  await user.save()
    .then(result => {
      res.status(200).json({ token: user.generateToken() })
    })
    .catch(next)
})

// Calls the userAuth middleware
// If the checks pass then the client is sent an access token
userRouter.post('/signin', userAuth, (req, res, next) => {
  res.status(200).json({ token: req.token, currentJournal: req.email.selectedJournal})
})

module.exports = userRouter
