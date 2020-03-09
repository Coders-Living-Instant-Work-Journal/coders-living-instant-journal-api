require('dotenv').config()
const { PORT, MONGODB_URI } = process.env
const mongoose = require('mongoose')

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
