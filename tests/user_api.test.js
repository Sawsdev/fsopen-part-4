const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const userTestHelper = require('../tests/user_test_helper.test')
const api = supertest(app)

describe('When there are users registered in the DB', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('deeznuts', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('should retrieve all users', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await userTestHelper.usersInDb()

    const newUser = {
      username: 'elMakFliPalachu',
      name: 'El Maromas',
      password: 'eldarlachupa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect( 'Content-Type', /application\/json/)

    const usersAtEnd = await userTestHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1 )

    const usernames = usersAtEnd.map( users => users.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if the username already exists in the DB', async () => {
    const usersAtStart = await userTestHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'El Maromas',
      password: 'eldarlachupa'
    }



    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(406)
      .expect( 'Content-Type', /application\/json/)

    const usersAtEnd = await userTestHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length )
    expect(result.body.errors.username.message).toContain('`username` to be unique')
  })

})


afterAll(async () => {
  await mongoose.connection.close()
})