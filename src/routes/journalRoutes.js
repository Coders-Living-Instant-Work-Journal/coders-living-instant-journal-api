const express = require('express')
const journalRouter = express.Router()

const Entry = require('../models/entry')

journalRouter.post('/create', async (req, res, next) => {
  req.body.date = (new Date()).toLocaleString()
  console.log(req.body)
  const entry = new Entry(req.body)
  await entry.save()
    .then(result => res.status(200).json({ entry }))
    .catch(next)
  console.log(entry)
})

journalRouter.get('/read', async (req, res, next) => {
  console.log(req.body)
  let allEntries
  if (req.body.category) allEntries = await Entry.find({ category: req.body.category })
  else allEntries = await Entry.find({})
  res.status(200).json(allEntries)
})

journalRouter.get('/read/:_id', async (req, res, next) => {
  const allEntries = await Entry.findOne({ id: req.body.id })
  res.status(200).json(allEntries)
})

journalRouter.put('/update/:_id', async (req, res, next) => {

})

journalRouter.delete('/delete/:_id', async (req, res, next) => {

})

module.exports = journalRouter
