const bcrypt  = require('bcrypt')
const isEmpty = require('lodash/isEmpty')
const merge   = require('lodash/merge')
const pick    = require('lodash/pick')

const User          = require('./model')
const Quiz          = require('../quiz/model')
const validate      = require('../../validations/signup')
const { signToken } = require('../../auth/auth')

const params = (req, res, next, username) => {
  User.findOne({ username })
  .select('-password')
  .exec()
  .then(user => {
    if (!user) next(new Error('No such user'))
    else {
      req.shownUser = user
      next()
    }
  })
  .catch(err => {
    next(err)
  })
}

const index = (req, res, next) => {
  User.find().lean()
    .select('_id username fullname')
    .sort({ createdAt: -1 })
    .exec()
    .then(users => {
      users = users.map(user =>
        merge(user, { followed: req.user.following.indexOf(user._id) >= 0 })
      )
      res.json({ users })
    })
    .catch(err => {
      logError(err)
      next(err)
    })
}

const show = (req, res, next) => {
  Quiz
    .find({ author: req.shownUser._id })
    .populate({ path:   'author'
              , select: { _id: 1, username: 1, fullname: 1 }
              }
             )
    .sort({ createdAt: -1 })
    .exec()
    .then(quizzes => {
      const user = merge(
        pick( req.shownUser.toObject()
            , [ '_id', 'createdAt', 'fullname', 'username' ]
            )
      , { followed: req.me && req.me.following.indexOf(req.shownUser._id) >= 0 }
      )

      res.json({ user, quizzes })
    })
    .catch(err => {
      logError(err)
      next(err)
    })
}

const validateUserData = data => {
  const { errors } = validate(data)

  return User
           .findOne( { $or: [ { username: data.username }
                            , { email:    data.email }
                            ]
                     }
                   )
           .exec()
           .then(user => {
             if (user) {
               if (user.username === data.username)
                 errors.username = 'There is a user with this name.'
               if (user.email === data.email)
                 errors.email = 'There is a user with this email address.'
             }

             return { errors
                    , isValid: isEmpty(errors)
                    }
           })
}

const create = (req, res, next) => {
  validateUserData(req.body)
    .then(({ errors, isValid }) => {
      if (isValid) {
        const { username, fullname, email, password } = req.body
        const passwordDigest = bcrypt.hashSync(password, 10)
        const newUser = new User({ username
                                 , fullname
                                 , email
                                 , password: passwordDigest
                                 }
                                )

        newUser
          .save()
          .then(user => {
            res.json({ token:    signToken(user._id)
                     , username: user.username
                     }
                    )
          })
          .catch(err => next(err))
      }
      else res.status(400).json(errors)
    })
}

module.exports = { params, index, show, create }
