const morgan = require('morgan');

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
  })

const requestLog = morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res)
    ].join(' ')
  })

  module.exports = {
    requestLog
  }