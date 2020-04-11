require('dotenv').config()
const { PORT, MONGODB_URI } = process.env
const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
// const sendEmail = require('./src/emailScheduler')
mongoose.connect(MONGODB_URI, options, () => {
  console.log('Connected to MongoDB.')
})
const User = require('./src/models/user')
let allUserIDs = []

// start express server
const app = require('./src/app')
app.start(PORT)
const Entry = require('./src/models/entry')

async function getAllUserIDs () {
  const allUsers = await User.find({})
  await allUsers.forEach(user => {
    allUserIDs.push([user._id, user.email, user.name])
  })
  getUserEntries(allUserIDs)
  allUserIDs = []
}
async function getUserEntries (allUserIDs) {
  await allUserIDs.forEach(async user => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 1)
    console.log(endDate, ' - ', startDate)
    const allEntries = await Entry.find({
      userId: user[0],
      date: {
        $gte: endDate,
        $lte: startDate
      }
    })
    let emailEntries = `<p>All entries for ${user[2]}</p> <hr>`
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
    // await sendEmail(emailEntries, user[1])
  })
}
const schedule = require('node-schedule')

const emailScheduler = schedule.scheduleJob('00 30 16 * * *', function () {
  getAllUserIDs()
})
