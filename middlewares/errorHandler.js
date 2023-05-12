const errorHandler = (error, req, res, next) => {
  console.error(error)
  console.log(error.name)
  if (error.name === 'CastError') {
    res.status(404).send({ error: 'id used is malformed' }).end()
  } else if (error.name === 'ValidationError') {
    res.status(403).json({ error: error.message }).end()
  } else {
    res.status(500).end()
  }
}

module.exports = errorHandler
