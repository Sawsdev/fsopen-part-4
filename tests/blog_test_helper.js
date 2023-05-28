const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  }
]

const blogPostsInDb = async () => {
  const blogs =  await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: 'imnothereson',
    author: 'notwithchamen',
    url: 'https://www.youregonnabegone.yeah'
  })
  await blog.save()
  await Blog.findByIdAndDelete(blog._id)

  return blog._id.toString()
}

module.exports = {
  initialBlogs, nonExistingBlogId, blogPostsInDb
}