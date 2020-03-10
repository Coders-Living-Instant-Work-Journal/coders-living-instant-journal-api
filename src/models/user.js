const mongoose = require('mongoose')

const user = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  journalId: { type: String }
})

module.exports = mongoose.model('user', user)
