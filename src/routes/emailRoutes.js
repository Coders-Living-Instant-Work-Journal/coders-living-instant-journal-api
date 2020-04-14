const express = require('express')
const emailRouter = express.Router()

const emailAuth = require('../middleware/emailAuth')
const Email = require('../models/email')

// Create new email profile
emailRouter.post('/createEmailProfile', emailAuth, async (req, res, next) => {
  const email = new Email(req.body)
  await email.save()
    .then(async () => {
      res.status(200).json({ email })
    })
    .catch(next)
})

module.exports = emailRouter
