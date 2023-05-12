require('dotenv').config()
const logger = require('./logger')
const mongoose = require('mongoose')
const config = require('./config')

const dbConnect = () => {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Database connected')
    })
    .catch(err => {
      logger.error(err)
    })
}

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
module.exports.dbConnService = {
  dbConnect
}
