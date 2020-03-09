const mongoose = require('mongoose')
const Entry = require('../models/entry')

class Journal {
  constructor(options) {
    this.crud = options.command.crud
    this.payload = options.command.payload
    options.command.text !== undefined
      ? this.text = options.command.text
      : this.text = undefined
    options.command.category !== undefined
      ? this.category = options.command.category
      : this.category = undefined
  }

  async execute () {
    switch (this.action) {
      case 'create': this.create(this.payload, this.category); break
      case 'read': this.read(this.payload); break
      case 'update': this.update(this.payload, this.text, this.category); break
      case 'delete': this.delete(this.payload); break
      default: Promise.resolve()
    }
  }

  async create(payload, category) {
    console.log(`Adding note of '${payload}' with category: ${category}`)
    let journalEntry = {
      entry: payload,
      category: category,
    }
    let journal = new Journal(journalEntry)
    await journal.save()
    mongoose.disconnect()
  }

  async read(payload) {
    let allEntries
    payload !== undefined 
      ? allEntries = await Note.find({ category: payload })
      : allEntries = await Note.find({})
    allEntries.forEach(entry => {
      console.log('')
      console.log('Journal Entry')
      console.log(`Entry Date: ${entry.date}`)
      console.log(`Entry Category: ${entry.category}`)
      console.log(`  "${entry.text}"`)
      console.log('')
      console.log('---------------------------------')
    })
    mongoose.disconnect()
  }

  async update(payload, text, category) {
    if (text && category !== undefined) {
      await Entry.updateOne({ '_id': payload },
        { 'text': text, 'category': category })
      console.log(`Updating journal entry text to: ${text}`)
      console.log(`Updating journal entry category to: ${category}`)
    } else if (text !== undefined) {
      await Entry.updateOne({ '_id':payload },
        { 'text': text })
    } else if ( category !== undefined) {
      await Entry.updateOne({ '_id': payload },
        {'category': category})
        console.log(`Updating note category to: ${category}`)
    }
    mongoose.disconnect()
  }

  async delete(payload) {
    await Entry.findByIdAndDelete(payload)
    mongoose.disconnect()
  }
}

module.exports = Journal
