const express = require('express')
const entryRouter = express.Router()

const bearerAuth = require('../middleware/bearerAuth')
const Entry = require('../models/entry')
const Journal = require('../models/journal')

// all routes use bearerAuth middleware
// verifies the provided access token
// also adds the user id and selected journal id to the req.body

// first adds the current time/date to the req.body
// then creates a new Entry instance
// saves the instance to the entry collection
entryRouter.post('/create', bearerAuth, async (req, res, next) => {


  req.body.date = (new Date()).toLocaleString()

  const entry = new Entry(req.body)
  await entry.save()
    .then(async result => {
      await Journal.findOneAndUpdate({ _id: req.body.journalId }, { $push: { entryIds: entry._id } })
      res.status(200).json({ entry })
    })
    .catch(next)
})

// Entry search route
// find entries for that user's selected journal
entryRouter.get('/read', bearerAuth, async (req, res, next) => {
  let allEntries
  // check if a category was sent
  if (req.body.category) {
    // check if a start date was also sent
    if (req.body.startDate) {
      // finds all entries of the specifed category and date range
      allEntries = await Entry.find({
        journalId: req.body.journalId,
        userId: req.body.userId,
        category: req.body.category,
        date: {
          $gte: req.body.startDate,
          $lte: req.body.endDate
        }
      })
    } else {
      // finds all entries of the specified category
      allEntries = await Entry.find({
        category: req.body.category,
        journalId: req.body.journalId,
        userId: req.body.userId
      })
    }
    // check if only start date was sent
  } else if (req.body.startDate) {
    // finds all entries of the specified date range
    allEntries = await Entry.find({
      journalId: req.body.journalId,
      userId: req.body.userId,
      date: {
        $gte: req.body.startDate,
        $lte: req.body.endDate
      }
    })
    // checks if entry ID was sent
  } else if (req.body.id) {
    // finds the one entry with given ID
    allEntries = await Entry.findOne({
      journalId: req.body.journalId,
      userId: req.body.userId,
      _id: req.body.id
    })
  } else {
    // finds all of the users entries in the selected journal
    allEntries = await Entry.find({
      journalId: req.body.journalId,
      userId: req.body.userId
    })
  }

  // if there were no results, return an error message
  if (allEntries.length === 0) allEntries.push('No entries found.')
  res.status(200).json(allEntries)
})

// Update entry route
entryRouter.put('/update', bearerAuth, async (req, res, next) => {
  // checks if both text and category are to be changed
  if (req.body.text && req.body.category) {
    // changes the entry text and category
    await Entry.updateOne({ _id: req.body.id }, { text: req.body.text, category: req.body.category })
    // respond with message of change(s)
    res.status(202).send(`
    Updating note text to: "${req.body.text}" 
    Updating note category to: "${req.body.category}"`)
    // checks if just the text is to be changed
  } else if (req.body.text) {
    // changes the entry text
    await Entry.updateOne({ _id: req.body.id }, { text: req.body.text })
    // respond with message of change(s)
    res.status(202).send(`
    Updating note text to: "${req.body.text}"`)
    // checks if just the category is to be changed
  } else if (req.body.category) {
    // changes the entry category
    await Entry.updateOne({ _id: req.body.id }, { text: req.body.category })
    // respond with message of change(s)
    res.status(202).send(`
    Updating note category to: "${req.body.category}"`)
  }
})

// Deletes the entry with the given ID
entryRouter.delete('/delete', bearerAuth, async (req, res, next) => {
  const deletedEntry = await Entry.findByIdAndDelete(req.body.id)
  res.status(202).send(`The following journal entry was deleted: \n{\n\tid: ${deletedEntry._id}\n\tdate: ${deletedEntry.date}\n\tcategory:${deletedEntry.category}\n\ttext:${deletedEntry.text}\n}`)
})

module.exports = entryRouter
