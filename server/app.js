const express  = require('express')
const mongoose = require('mongoose')

const config             = require('./config')
const installMiddlewares = require('./middlewares')
const apiRouter          = require('./api')
const authRouter         = require('./auth/router')
const { logError }       = require('./util/logger')

const app = express()

mongoose.Promise = global.Promise
mongoose.connect(config.db.url)

installMiddlewares(app)

app.use('/api', apiRouter)
app.use('/auth', authRouter)

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError')
    return res.status(401).send('Invalid token')

  logError(err.stack)

  res.status(500).send('Something went wrong.')
})

module.exports = app
