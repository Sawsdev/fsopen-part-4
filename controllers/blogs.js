const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogRouter.post('/', (request, response) => {
    const  {
      body
    } = request
    if(!body.title )
    return response.status(400).send({error: "no title provided"}).end()
    
    const blog = new Blog(body)
    
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  

module.exports = blogRouter