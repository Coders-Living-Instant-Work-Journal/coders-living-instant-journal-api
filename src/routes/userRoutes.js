// dependecies
const express = require('express')
const superagent = require('superagent')
const userRouter = express.Router()

const User = require('../models/user')
const googleOAuth = require('../middleware/googleOAuth')
const gitHubOAuth = require('../middleware/gitHubOAuth')

const { WEBAPP_REDIRECT } = process.env

// Takes in the provider name, access token, and user e-mail
userRouter.post('/authenticate', async (req, res) => {
  try {
    let user
    // Validates access token with provider and grabs the user's external ID and name
    const response = await superagent
      .get('https://api.github.com/user')
      .set('Authorization', `token ${req.body.token}`)
      .set('user-agent', 'express-app')

    // Checks if user exists in DB with external ID
    const potentialUser = await User.findOne({ extId: response.body.node_id })
    if (req.body.currentUser) {
      // if user attempts to sign-in but the user does not exist, return an error
      if (!potentialUser) res.status(401).send('User does not exist. Please sign-up.')
      // otherwise generate a token and return to client
      else res.status(200).json({ token: potentialUser.generateToken() })
    } else if (!req.body.currentUser) {
      if (!potentialUser) {
        // Stores that user instance to the user collection if user doesn't exist
        const newUser = new User({ extId: response.body.node_id, name: response.body.name, email: req.body.email })
        user = await newUser.save()
      } else user = potentialUser
      // Then a token is generated and returned to the client
      res.status(200).json({ token: user.generateToken() })
    }
  } catch (error) {
    console.log(error)
  }
})

// Calls the googleAuth middleware
// If the checks pass then the client is sent an access token
userRouter.get('/googleOAuth', googleOAuth, (req, res) => {
  res.cookie('Auth-Token', req.token).redirect(WEBAPP_REDIRECT)
})

// Calls the gitHubAuth middleware
// If the checks pass then the client is sent an access token
userRouter.get('/gitHubOAuth', gitHubOAuth, (req, res) => {
  res.redirect(`${WEBAPP_REDIRECT}?token=${req.token}`)
})

module.exports = userRouter
