require('dotenv').config()
const { PORT, MONGODB_URI } = process.env
const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
const sendEmail = require('./src/emailScheduler')
mongoose.connect(MONGODB_URI, options, () => {
  console.log('Connected to MongoDB.')
})

// start express server
const app = require('./src/app')
app.start(PORT)
const Entry = require('./src/models/entry')
const Email = require('./src/models/email')
// const getUserEntries = require('./src/emailScheduler')
const schedule = require('node-schedule')

async function getUserEntries (foundProfiles) {
  console.log(foundProfiles)

  const current = new Date()
  const today = current.getDate()
  console.log(today)
  await foundProfiles.forEach(async profile => {
    console.log(profile.everyMonth === false || (profile.everyMonth === true && profile.dayOfMonth.includes(today)))
    if (profile.biWeekly && !profile.thisWeek) await Email.findOneAndUpdate({ _id: profile._id }, { thisWeek: true })
    else if (profile.everyMonth === false || (profile.everyMonth === true && profile.dayOfMonth.includes(today))) {
      await Email.findOneAndUpdate({ _id: profile._id }, { thisWeek: false })
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() - profile.entryRange)
      console.log(endDate, ' - ', startDate)
      const allEntries = await Entry.find({
        userId: profile.userId,
        journalId: profile.journalId,
        category: profile.category,
        date: {
          $gte: endDate,
          $lte: startDate
        }
      })
      let emailEntries = '<p>Here are your journal entries.</p> <hr>'
      allEntries.forEach(entry => {
        emailEntries += '<p></p>'
        emailEntries += `<p> Entry Date & Time: ${entry.date.toLocaleString()}`
        emailEntries += `<p> ${entry.journalId.name} Journal</p>`
        emailEntries += `<p> Category: ${entry.category}</p>`
        emailEntries += `<p>"${entry.text}"</p>`
        emailEntries += `<p> Entry ID: ${entry._id}`
        emailEntries += '<hr>'
      })
      console.log('the users email ', emailEntries)
      await sendEmail(emailEntries, profile.emailAddr)
    }
  })
}

schedule.scheduleJob('*/5 * * * *', async function () {
  const current = new Date()
  const time = current.getHours() + ':' + current.getMinutes()
  const day = current.getDay()
  const foundProfiles = await searchEmailProfiles(time, day)
  getUserEntries(foundProfiles)
})

async function searchEmailProfiles (time, day) {
  const allProfiles = await Email.find({ emailTime: time, emailDay: day })
  return allProfiles
}
