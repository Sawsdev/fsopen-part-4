const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const blogTestHelper = require('../tests/blog_test_helper')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogPost = new Blog(blogTestHelper.initialBlogs[0])
  await blogPost.save()
  blogPost = new Blog(blogTestHelper.initialBlogs[1])
  await blogPost.save()
  blogPost = new Blog(blogTestHelper.initialBlogs[2])
  await blogPost.save()
  blogPost = new Blog(blogTestHelper.initialBlogs[3])
  await blogPost.save()
})
describe('When there are blog post in the DB', () => {

  test('blog posts are returned in JSON', async () => {
    await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are 4 blog posts', async () => {
    const response = await api.get('/api/blog')
    expect(response.body).toHaveLength(blogTestHelper.initialBlogs.length)
  })

  test('should have the id property', async () => {
    const response = await api.get('/api/blog')

    response.body.map((post) => {
      expect(post.id).toBeDefined()
    })
  })
})

describe('When creating a  new blog post', () => {

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
    const response = await blogTestHelper.blogPostsInDb()
    expect(response.length).toBe(blogTestHelper.initialBlogs.length + 1)
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
})



afterAll(async () => {
  await mongoose.connection.close()
})