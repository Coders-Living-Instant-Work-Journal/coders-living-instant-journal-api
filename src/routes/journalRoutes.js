const express = require('express')
const journalRouter = express.Router()

const bearerAuth = require('../middleware/bearerAuth')
const Journal = require('../models/journal')
const Entry = require('../models/entry')

journalRouter.post('/createj', bearerAuth, async (req, res, next) => {
  const journal = new Journal(req.body)
  console.log(journal)
  await journal.save()
    .then(result => {
      console.log(result)
      res.status(200).json({ journalId:result._id })
    })
    .catch(next)
})

journalRouter.get('/readj', bearerAuth, async (req, res, next) => {
  const allJournal = await Journal.find({ _id: req.body.id })
  console.log(allJournal)
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
