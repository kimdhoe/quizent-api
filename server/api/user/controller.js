const User    = require('./model')
const isEmpty = require('lodash/isEmpty')
const bcrypt = require('bcrypt')

const validate      = require('../../validations/signup')
const { signToken } = require('../../auth/auth')

const index = (req, res, next) => {
  User.find()
    .select('_id username fullname')
    .sort({ createdAt: -1 })
    .then(users => {
      res.json({ users })
    })
    .catch(err => next(err))
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

module.exports = { index, create }
