const bodyParser     = require('body-parser')
const cors           = require('cors')
const methodOverride = require('method-override')
const morgan         = require('morgan')

const config = require('../config')

const corsOptions =
  { origin:               'https://quizent-api.herokuapp.com'
  , optionsSuccessStatus: 200
  }

const installMiddlewares = app => {
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(cors(corsOptions))
  app.use(methodOverride())
  app.use(morgan(config.morgan))
}

module.exports = installMiddlewares
