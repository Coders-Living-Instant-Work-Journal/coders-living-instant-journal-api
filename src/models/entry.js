const mongoose = require('mongoose')

const entry = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  journalId: { type: mongoose.Schema.Types.ObjectId, ref: 'journal', autopopulate: true },
  category: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true }
})

entry.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('entry', entry)
