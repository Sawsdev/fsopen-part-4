const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  }
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogPost = new Blog(initialBlogs[0])
  await blogPost.save()
  blogPost = new Blog(initialBlogs[1])
  await blogPost.save()
  blogPost = new Blog(initialBlogs[2])
  await blogPost.save()
  blogPost = new Blog(initialBlogs[3])
  await blogPost.save()
})

test('blog posts are returned in JSON', async () => {
  await api
    .get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 4 blog posts', async () => {
  const response = await api.get('/api/blog')
  expect(response.body).toHaveLength(4)
})

test('should have the id property', async () => {
  const response = await api.get('/api/blog')

  response.body.map((post) => {
    expect(post.id).toBeDefined()
  })
})

test('should add a new blog post', async () => {
  const newBlogPost = {
    title: 'Black Shitposting',
    author: 'You jonas',
    url: 'https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2',
    likes: 2
  }
  await api
    .post('/api/blog')
    .send(newBlogPost)
    .set('Content-type', 'application/json')
    .set('Accept', /application\/json/)
  const response = await api.get('/api/blog')
  expect(response.body.length).toBe(5)
})

test('should add likes propery = 0 in a new blog post if not specified', async () => {
  const newBlogPost = {
    title: 'Black Shitposting',
    author: 'You jonas',
    url: 'https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2'
  }
  const response = await api
    .post('/api/blog')
    .send(newBlogPost)
    .set('Content-type', 'application/json')
    .set('Accept', /application\/json/)
  console.log(response.body.likes)
  expect(response.body.likes).toBeDefined()
  expect(response.body.likes).toBe(0)
})

test('should respond with status 400 if no title provided in a new blog post request', async () => {
  const newBlogPost = {

    author: 'You jonas',
    url: 'https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2'
  }
  await api
    .post('/api/blog')
    .send(newBlogPost)
    .set('Content-type', 'application/json')
    .set('Accept', /application\/json/)
    .expect(400)
})

afterAll(async () => {
  await mongoose.connection.close()
})