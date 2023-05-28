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


module.exports = blogRouter