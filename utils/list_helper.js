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

module.exports = {
  dummy, totalLikes
}