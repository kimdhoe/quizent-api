const jwt    = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pick   = require('lodash/pick')

const config = require('../config')
const User   = require('../api/user/model')

const getMe = () => (req, res, next) => {
  if (req.query && req.query.hasOwnProperty('access_token'))
    req.headers.authorization = `Bearer ${req.query.access_token}`

  let token = ''

  if (req.headers.authorization)
    token = req.headers.authorization.split(' ')[1]

  if (token) {
    jwt.verify(token, config.secrets.jwt, (err, decoded) => {
      if (err) next()
      else {
        User
          .findById(decoded._id)
          .select('following')
          .exec()
          .then(user => {
            req.me = user
            next()
          })
          .catch(err => {
            logError(err)
            next()
          })
      }
    })
  }
  else next()
}

const decodeToken = () => (req, res, next) => {
  if (req.query && req.query.hasOwnProperty('access_token'))
    req.headers.authorization = `Bearer ${req.query.access_token}`

  let token = ''

  if (req.headers.authorization)
    token = req.headers.authorization.split(' ')[1]

  if (token) {
    jwt.verify(token, config.secrets.jwt, (err, decoded) => {
      if (err)
        res.status(401).json({ error: 'Failed to authenticate.' })
      else {
        req.user = { _id: decoded._id }
        next()
      }
    })
  }
  else
    res.status(403).send('토큰이 필요합니다.')
}

const getUser = () => (req, res, next) => {
  User
    .findById(req.user._id)
    .then(user => {
      if (!user) {
        res.status(401).json({ error: 'No such user.' })
      }
      else {
        req.user = user
        next()
      }
    })
    .catch(err => next(err))
}

const authenticateUser = (user, pw) =>
  bcrypt.compareSync(pw, user.password)

const verifyUser = () => (req, res, next) => {
  const { identifier, password } = req.body

  User
    .findOne({ $or: [ { username: identifier }
                    , { email:    identifier }
                    ]
             }
            )
    .then(user => {
      if (user && authenticateUser(user, password)) {
        req.user = user
        next()
      }
      else
        res.status(401).json({ errors: { form: 'Invalid credentials.' } })
    })
    .catch(err => next(error))
}

// Given a user ID, generates a token.
const signToken = _id =>
  jwt.sign( { _id }
          , config.secrets.jwt
          , { expiresIn: config.expireTime }
          )

module.exports = { getMe, decodeToken, getUser, verifyUser, signToken }
