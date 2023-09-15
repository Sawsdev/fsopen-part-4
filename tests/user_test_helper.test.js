const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  usersInDb
}