const { Schema, model } = require('mongoose')

/**
 * Schema for blog posts
 */

const blogSchema = Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJson', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
});

const Blog = model('Blog', blogSchema)

module.exports = Blog