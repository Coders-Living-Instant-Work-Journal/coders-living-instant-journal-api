const express = require('express')
const userRouter = express.Router()

const User = require('../models/user')

userRouter.post('/signup', async (req, res, next) => {
  const user = new User(req.body)
  await user.save()
    .then(result => res.status(200).json({ user }))
    .catch(next)
})

module.exports = userRouter
