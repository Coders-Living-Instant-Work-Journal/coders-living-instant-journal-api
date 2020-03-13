// dependencies
const mongoose = require('mongoose')

const journal = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  name: { type: String, required: true }
})

journal.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('journal', journal)
