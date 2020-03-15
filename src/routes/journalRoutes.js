// dependencies
const express = require('express')
const journalRouter = express.Router()

const bearerAuth = require('../middleware/bearerAuth')
const Journal = require('../models/journal')
const Entry = require('../models/entry')
const User = require('../models/user')

// all routes use bearerAuth middleware
// verifies the provided access token
// also adds the user id and selected journal id to the req.body

// updates the selectedJournal field of the user with the chosen journal id
journalRouter.post('/selectj', bearerAuth, async (req, res, next) => {
  await User.updateOne({ _id: req.body.userId }, { selectedJournal: req.body.jId })
  res.status(202).send(`
    You've selected the journal: "${req.body.name}"`)
})

// creates a new journal instance and stores it the the DB
// also updates the selectedJournal field of the user with the chosen journal id
journalRouter.post('/createj', bearerAuth, async (req, res, next) => {
  const journal = new Journal(req.body)
  await journal.save()
    .then(async result => {
      await User.updateOne({ _id: req.body.userId }, { selectedJournal: journal._id })
      res.status(200).send(`The ${result.name} journal was created and selected`)
    })
    .catch(next)
})

// returns a list of all the user's journals
journalRouter.get('/readj', bearerAuth, async (req, res, next) => {
  const allJournal = await Journal.find({ userId: req.body.userId })
  res.status(200).json(allJournal)
})

// changes the name field of the specified journal
journalRouter.put('/updatej', bearerAuth, async (req, res, next) => {
  await Journal.updateOne({ _id: req.body.id }, { name: req.body.name })
  res.status(202).send(`
    Updating journal name to: "${req.body.name}"`)
})

// first finds all entrys of given journal
// then deletes each entry one by one
// finally deletes the given journal
journalRouter.delete('/deletej', bearerAuth, async (req, res, next) => {
  const toBeDeleted = await Journal.findOne({ _id: req.body.id })
  toBeDeleted.entryIds.forEach(async (obj) => { await Entry.findByIdAndDelete(obj._id) })
  const deletedJournal = await Journal.findByIdAndDelete(req.body.id)
  const nextJournal = await Journal.find({})
  if (nextJournal.length > 0) {
    await User.updateOne({ _id: req.body.userId }, { selectedJournal: nextJournal[0]._id })
  } else {
    const journal = new Journal({ name: 'Work', userId: req.body.userId })
    await journal.save()
      .then(async result => {
        await User.updateOne({ _id: req.body.userId }, { selectedJournal: journal._id })
      })
      .catch(next)
  }
  res.status(202).send(`The following journal was deleted: 
  ${deletedJournal}`)
})

module.exports = journalRouter
