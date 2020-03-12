// Third-party dependencies
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Routes
const entryRouter = require('./routes/entryRoutes')
app.use(entryRouter)
const userRouter = require('./routes/userRoutes')
app.use(userRouter)
const journalRouter = require('./routes/journalRoutes')
app.use(journalRouter)

// Catch-alls
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)
const notFound = require('./middleware/404')
app.use(notFound)

module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}.`)
    })
  }
}
