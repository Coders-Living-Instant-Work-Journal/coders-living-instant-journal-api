// dependencies
const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')

// const SHHHHH = process.env.SHHHHH

const journal = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', autopopulate: true },
  name: { type: String, required: true },
  entryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'entry', autopopulate: true }]
})

journal.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('journal', journal)
