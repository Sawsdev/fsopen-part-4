const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', (request, response) => {
  User
    .find({})
    .then( users => {
      response.json(users)
    })
})

userRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body
  if (!username || !name || !password)
  {
    return response.status(400).send({ error: 'no username, password or name provided' }).end()
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password,saltRounds)
  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  return response.status(201).json(savedUser)
})

module.exports = userRouter