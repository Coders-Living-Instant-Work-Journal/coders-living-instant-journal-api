// dependecies
const express = require('express')
const superagent = require('superagent')
const userRouter = express.Router()

const User = require('../models/user')
const userAuth = require('../middleware/userAuth')
const oAuth = require('../middleware/googleOauth')
const gitHubOAuth = require('../middleware/oauth')

const REMOTE_API_ENDPOINT = 'https://api.github.com/user'

// Takes in the provider name, access token, and user e-mail
userRouter.post('/authenticate', async (req, res) => {
  try {
    // Validates access token with provider and grabs the user's external ID and name
    const response = await superagent
      .get(REMOTE_API_ENDPOINT)
      .set('Authorization', `token ${req.body.token}`)
      .set('user-agent', 'express-app')

    // Checks if user exists in DB with external ID
    const potentialUser = await User.findOne({ extId: response.body.node_id })
    let user
    // Stores that user instance to the user collection if user doesn't exist
    if (!potentialUser) {
      const newUser = new User({ extId: response.body.node_id, name: response.body.name, email: req.body.email })
      user = await newUser.save()
    } else user = potentialUser
    // Then a token is generated and returned to the client
    res.status(200).json({ token: user.generateToken() })
  } catch (error) {
    console.log(error)
  }
})

// Calls the userAuth middleware
// If the checks pass then the client is sent an access token
userRouter.post('/signin', userAuth, (req, res, next) => {
  res.status(200).json({ token: req.token, currentJournal: req.email.selectedJournal })
})

userRouter.get('/oauth', oAuth, (req, res, next) => {
  res.status(200).json({ message: 'signed in with oauth' })
})

userRouter.get('/gitHubOAuth', gitHubOAuth, (req, res, next) => {
  res.status(200).json({ message: 'signed in with oauth' })
})

module.exports = userRouter
