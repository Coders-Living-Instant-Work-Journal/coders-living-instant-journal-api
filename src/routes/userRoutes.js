const express = require('express')
const userRouter = express.Router()

const User = require('../models/user')
const userAuth = require('../middleware/userAuth')

userRouter.post('/signup', async (req, res, next) => {
  const user = new User(req.body)
  await user.save()
    .then(result => res.status(200).json({ token: user.generateToken() }))
    .catch(next)
})

userRouter.post('/signin', userAuth, (req, res, next) => {
  res.status(200).json({ token: req.token })
})

module.exports = userRouter
