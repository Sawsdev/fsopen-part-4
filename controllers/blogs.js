const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('/', async (request, response) => {
  const  {
    body
  } = request
  if(!body.title )
    return response.status(400).send({ error: 'no title provided' }).end()
  if(!body.likes)
    body.likes = 0
  const blog = new Blog(body)

  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const {
    params: { id }
  } = request
  if(!id)
    response.status(400).send({ error: 'Bad Request' }).end()

  const blogPost = await Blog.findById(id)
  if(!blogPost || blogPost === null){
    response.status(400).send({ error:'Bad Request' }).end()
  }
  else {
    const result = await Blog.findByIdAndDelete(blogPost._id)
    if (result) {
      response.status(204).json(result.body).end()
    }

  }
})

blogRouter.put('/:id', async (request, response ) => {
  const {
    params: { id },
    body
  } = request
  if(!id )
    response.status(400).send({ error: 'Bad request' }).end()

  const existingBlog = await Blog.findById(id)

  if (!existingBlog || existingBlog === null) {
    response.status(400).send({ error: 'Incorrect id' }).end()
  }
  else
  {

    if (!body.title){
      response.status(400).send({ error: 'No title provided. A title is needed' }).end()
    }
    else {

      const newBlogPost = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      }
      const updatedBlog = await Blog.findByIdAndUpdate(id, newBlogPost, { new: true })
      response.json(updatedBlog)
    }

  }

})

module.exports = blogRouter