const express = require('express')
const entryRouter = express.Router()

const bearerAuth = require('../middleware/bearerAuth')
const Entry = require('../models/entry')

entryRouter.post('/create', bearerAuth, async (req, res, next) => {
  console.log('create ', req.user)
  req.body.date = (new Date()).toLocaleString()
  const entry = new Entry(req.body)
  await entry.save()
    .then(result => res.status(200).json({ entry }))
    .catch(next)
})

entryRouter.get('/read', bearerAuth, async (req, res, next) => {
  let allEntries
  if (req.body.category) {
    if (req.body.startDate) {
      allEntries = await Entry.find({
        category: req.body.category,
        date: {
          $gte: req.body.startDate,
          $lte: req.body.endDate
        }
      })
    } else allEntries = await Entry.find({ category: req.body.category })
  } else if (req.body.startDate) {
    allEntries = await Entry.find({
      date: {
        $gte: req.body.startDate,
        $lte: req.body.endDate
      }
    })
  } else if (req.body.id) allEntries = await Entry.findOne({ _id: req.body.id })
  else allEntries = await Entry.find({ userId: req.body.userId })
  res.status(200).json(allEntries)
})

entryRouter.put('/update', bearerAuth, async (req, res, next) => {
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

entryRouter.delete('/delete', bearerAuth, async (req, res, next) => {
  const deletedEntry = await Entry.findByIdAndDelete(req.body.id)
  res.status(202).send(`The following journal entry was deleted: \n{\n\tid: ${deletedEntry._id}\n\tdate: ${deletedEntry.date}\n\tcategory:${deletedEntry.category}\n\ttext:${deletedEntry.text}\n}`)
})

module.exports = entryRouter
