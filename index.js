require('dotenv').config()
const { PORT, MONGODB_URI } = process.env
const mongoose = require('mongoose')

const Journal = require('./src/lib/entry')
const Input = require('./src/lib/input')

const input = new Input()
const entry = new Journal(input)

entry.execute(input)

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

mongoose.connect(MONGODB_URI, options, () => {
  console.log('Connected to MongoDB.')
})

// start express server
const app = require('./src/app')
app.start(PORT)
