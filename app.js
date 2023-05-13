const { dbConnService } = require('./utils/db')
dbConnService.dbConnect()
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const requestLogger = require('./middlewares/requestLogger')
const errorHandler = require('./middlewares/errorHandler')
const notFound = require('./middlewares/notFound')

app.use(cors())
app.use(express.json())
app.use(requestLogger.requestLog)
app.use('/api/blog', blogRouter)


app.use(notFound)
app.use(errorHandler)

module.exports = app
