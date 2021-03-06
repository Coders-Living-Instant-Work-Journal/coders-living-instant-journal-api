// dependencies
const mongoose = require('mongoose')

const email = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', autopopulate: true },
  journalId: { type: mongoose.Schema.Types.ObjectId, ref: 'journal', autopopulate: true },
  emailDay: { type: Array, required: true },
  emailTime: { type: String, require: true },
  biWeekly: { type: Boolean, require: true },
  thisWeek: { type: Boolean, require: true },
  everyMonth: { type: Boolean, require: true },
  dayOfMonth: { type: Array, required: false },
  entryRange: { type: Number, required: true },
  profileName: { type: String, required: true, unique: true },
  emailAddr: { type: String, required: true },
  category: { type: String, required: true }
})

email.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('email', email)
