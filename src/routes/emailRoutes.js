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

// List email profiles
emailRouter.get('/readEmailProfiles', emailAuth, async (req, res, next) => {
  const allEmailProfiles = await Email.find({ userId: req.body.userId })
  res.status(200).json(allEmailProfiles)
})

// Update an email profile
emailRouter.put('/updateEmailProfile', emailAuth, async (req, res, next) => {
  console.log(req.body)
  await Email.updateOne({ _id: req.body.id }, {
    profileName: req.body.profileName,
    journalId: req.body.journalId,
    emailFreq: req.body.emailFreq,
    emailTime: req.body.emailTime,
    entryRange: req.body.entryRange,
    emailAddr: req.body.emailAddr,
    category: req.body.category
  })
  res.status(202).json(req.body)
})

module.exports = emailRouter
