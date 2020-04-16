const express = require('express')
const emailRouter = express.Router()

const emailAuth = require('../middleware/emailAuth')
const sendEmail = require('../emailScheduler')
const Email = require('../models/email')
const Entry = require('../models/entry')

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
  try {
    const allEmailProfiles = await Email.find({ userId: req.body.userId })
    res.status(200).json(allEmailProfiles)
  } catch (next) {}
  const allEmailProfiles = await Email.find({ userId: req.body.userId })
  res.status(200).json(allEmailProfiles)
})

// Update an email profile
emailRouter.put('/updateEmailProfile', emailAuth, async (req, res, next) => {
  try {
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
  } catch (next) {}
})

// Delete an email profile
emailRouter.delete('/deleteEmailProfile', emailAuth, async (req, res, next) => {
  try {
    const deletedProfile = await Email.findByIdAndDelete(req.body.id)
    res.status(202).json({ deletedProfile })
  } catch (next) {}
})

// Send email now
emailRouter.post('/sendNow', emailAuth, async (req, res, next) => {
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() - req.body.entryRange)
  const allEntries = await Entry.find({
    userId: req.body.userId,
    journalId: req.body.journalId,
    category: req.body.category,
    date: {
      $gte: endDate,
      $lte: startDate
    }
  })
  let emailEntries = `<p>All entries for ${allEntries[0].userId.name} </p> <hr>`
  allEntries.forEach(entry => {
    emailEntries += '<p></p>'
    emailEntries += `<p> Entry Date & Time: ${entry.date.toLocaleString()}`
    emailEntries += `<p> ${entry.journalId.name} Journal</p>`
    emailEntries += `<p> Category: ${entry.category}</p>`
    emailEntries += `<p>"${entry.text}"</p>`
    emailEntries += `<p> Entry ID: ${entry._id}`
    emailEntries += '<hr>'
  })
  console.log('the users email ', emailEntries)
  await sendEmail(emailEntries, req.body.email)
  res.status(200).send('Email sent!')
})

module.exports = emailRouter
