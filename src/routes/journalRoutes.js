const express = require('express')
const journalRouter = express.Router()

const Entry = require('../models/entry')

journalRouter.post('/create', async (req, res, next) => {
  req.body.date = (new Date()).toLocaleString()
  const entry = new Entry(req.body)
  await entry.save()
    .then(result => res.status(200).json({ entry }))
    .catch(next)
})

journalRouter.get('/read', async (req, res, next) => {
  let allEntries
  // console.log(req.body)
  if (req.body.category) allEntries = await Entry.find({ category: req.body.category })
  else if (req.body.id) allEntries = await Entry.findOne({ _id: req.body.id })
  else allEntries = await Entry.find({})
  // console.log(allEntries)
  res.status(200).json(allEntries)
})

journalRouter.put('/update', async (req, res, next) => {
  if (req.body.text && req.body.category) {
    await Entry.updateOne({ _id: req.body.id }, { text: req.body.text, category: req.body.category })
    res.status(202).send(`
    Updating note text to: "${req.body.text}" 
    Updating note category to: "${req.body.category}"`)
  } else if (req.body.text) {
    await Entry.updateOne({ _id: req.body.id }, { text: req.body.text })
    res.status(202).send(`
    Updating note text to: "${req.body.text}"`)
  } else if (req.body.category) {
    await Entry.updateOne({ _id: req.body.id }, { text: req.body.category })
    res.status(202).send(`
    Updating note category to: "${req.body.category}"`)
  }
})

journalRouter.delete('/delete', async (req, res, next) => {
  console.log(req.body.id)
  const deletedEntry = await Entry.findOne({ _id: req.body.id })
  await Entry.findByIdAndDelete(req.body.id)
  res.status(202).send(`The following journal entry was deleted: 
  ${deletedEntry}`)
})

module.exports = journalRouter
