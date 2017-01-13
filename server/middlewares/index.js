const bodyParser     = require('body-parser')
const cors           = require('cors')
const methodOverride = require('method-override')
const morgan         = require('morgan')

const config = require('../config')

const installMiddlewares = app => {
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.options('*', cors())
  app.use(cors())
  app.use(methodOverride())
  app.use(morgan(config.morgan))
}

module.exports = installMiddlewares
