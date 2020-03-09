const mongoose = require('mongoose')

const entry = mongoose.Schema({
  category: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true }
})

module.exports = mongoose.model('entry', entry)
