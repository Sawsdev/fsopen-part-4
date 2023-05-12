const notFound = (req, res, next) => {
  res.status(404).end()
}

module.exports = notFound
