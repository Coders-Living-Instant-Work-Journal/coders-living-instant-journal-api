// Third-party dependencies
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}.`)
    })
  }
}
