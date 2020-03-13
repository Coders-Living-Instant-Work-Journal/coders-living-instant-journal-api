const express = require('express')
const journalRouter = express.Router()

const bearerAuth = require('../middleware/bearerAuth')
const Journal = require('../models/journal')
const Entry = require('../models/entry')
const User = require('../models/user')

journalRouter.post('/selectj', bearerAuth, async (req, res, next) => {
  await User.updateOne({ _id: req.body.userId }, { selectedJournal: req.body.jId })
  res.status(202).send(`
    You've selected the journal: "${req.body.name}"`)
})
journalRouter.post('/createj', bearerAuth, async (req, res, next) => {
  const journal = new Journal(req.body)
  await journal.save()
    .then(result => {
      res.status(200).json({ journalId:result._id })
    })
    .catch(next)
})

journalRouter.get('/readj', bearerAuth, async (req, res, next) => {
  const allJournal = await Journal.find({ userId: req.body.userId })
  res.status(200).json(allJournal)
})

journalRouter.put('/updatej', bearerAuth, async (req, res, next) => {
  await Journal.updateOne({ _id: req.body.id }, { name: req.body.name })
  res.status(202).send(`
    Updating journal name to: "${req.body.name}"`)
})

journalRouter.delete('/deletej', bearerAuth, async (req, res, next) => {
  const toBeDeleted = await Journal.findOne({ _id: req.body.id })
  toBeDeleted.entryIds.forEach(async (obj) => { await Entry.findByIdAndDelete(obj._id) })
  const deletedJournal = await Journal.findByIdAndDelete(req.body.id)
  res.status(202).send(`The following journal was deleted: 
  ${deletedJournal}`)
})

module.exports = journalRouter
