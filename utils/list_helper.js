const dummy = (blogs) => {
  if(blogs.length >= 0)
    return 1
}

const totalLikes = (blogs) => {
  if(blogs.length <= 0)
    return blogs.length
  if (blogs.length === 1)
    return blogs[0].likes
  const result = blogs.reduce((sum, blog) => sum + blog.likes,0 )
  return result
}

const favoriteBlog = (blogs) => {
  const arr = blogs.map((blog) =>  blog.likes)
  const maxLikesCount = Math.max(...arr)
  const result = blogs.find((blog) => blog.likes === maxLikesCount )

  return {
    author : result.author,
    likes : result.likes,
    title : result.title,
  }
}

const mostBlogs = (blogs) => {
  const authorBlogEntries = blogs.map((blog) => {
    return getAuthorBlogEntries(blogs, blog.author)
  })
  const maxAuthorEntries = Math.max(... authorBlogEntries.map((blogEntry) => blogEntry.blogs))
  const result = authorBlogEntries.find((entry) => entry.blogs === maxAuthorEntries)
  return  result
}

const getAuthorBlogEntries = (blogs, blogEntryAuthor) => {
  const authorEntries = {
    author: blogEntryAuthor,
    blogs: 0,
  }
  blogs.forEach(blog => {
    if(authorEntries.author === blog.author)
      authorEntries.blogs = authorEntries.blogs + 1
  })

  return authorEntries
}

const mostLikes = (blogs) => {
  const authorLikes = getAuthorTotalLikes(blogs)

  const maxAuthorLikes = Math.max(...authorLikes.map((authorLike) => authorLike.likes))
  const result = authorLikes.find((authorBlog) => authorBlog.likes === maxAuthorLikes)
  return result
}

const getAuthorTotalLikes = (blogs) => {
  const authorLikes = []
  blogs.forEach(blog => {
    let partialBlog = {
      author: blog.author,
      likes: 0
    }
    if (!authorLikes.includes(partialBlog)) {
      authorLikes.push(partialBlog)
    }
  })
  const purgedArr = authorLikes.filter((value, index, array) => array.findIndex(arrValue => (arrValue.author === value.author)) === index)

  return purgedArr.map((blogLikes) => {
    return {
      author:blogLikes.author,
      likes: blogs.filter((blog) => blog.author === blogLikes.author).reduce((acum, result) => acum + result.likes, 0)
    }
  })
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}