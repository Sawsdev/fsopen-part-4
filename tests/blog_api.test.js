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
}, 100000)
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

describe('When deleting a single blog post', () => {
  test('succeeds returning status 204 if id is valid', async () => {
    const blogsAtStart = await blogTestHelper.blogPostsInDb()
    const id = blogsAtStart[0].id
    await api
      .delete(`/api/blog/${id}`)
      .expect(204)
  }, 100000)

  test('should return 400 if the id is not valid', async () => {
    const wrongId = await blogTestHelper.nonExistingBlogId()
    await api
      .delete(`/api/blog/${wrongId}`)
      .expect(400)
  }, 100000)

  test('should return 404 if no id provided', async () => {
    await api
      .delete('/api/blog/')
      .expect(404)
  })
})

describe('When updating a single blog post', () => {
  test('should return status 200 if succeded and id is valid and title is not empty', async () => {
    const blogsAtStart = await blogTestHelper.blogPostsInDb()
    const id = blogsAtStart[0].id
    await api
      .put(`/api/blog/${id}`)
      .send({
        title: 'New title ghetz',
        author: blogsAtStart[0].author,
        url: 'https://www.newmothafuckinblog.ye',
        likes: 0
      })
      .expect(200)
    const response = await blogTestHelper.blogPostsInDb()
    expect(response[0].title).toBe('New title ghetz')
  })

  test('should return status 400 if id is not valid', async () => {
    const wrongId = await blogTestHelper.nonExistingBlogId()
    await api
      .put(`/api/blog/${wrongId}`)
      .send({
        title: 'Blazin blades spotted',
        author: 'Carl marx',
        url: 'https://www.newsfeed.com',
        likes: 50
      })
      .expect(400)

  })

  test('should return status 400 if title is empty', async () => {
    const blogs = await blogTestHelper.blogPostsInDb()
    const id = blogs[0].id
    await api
      .put(`/api/blog/${id}`)
      .send({
        author: 'Carl marx',
        url: 'https://www.newsfeed.com',
        likes: 50
      })
      .expect(400)
    const response = await blogTestHelper.blogPostsInDb()
    expect(response[0]).toEqual(blogs[0])
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})