const User    = require('./model')
const isEmpty = require('lodash/isEmpty')
const bcrypt = require('bcrypt')

const validate      = require('../../validations/signup')
const { signToken } = require('../../auth/auth')

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
        const { username, email, password } = req.body
        const passwordDigest = bcrypt.hashSync(password, 10)
        const newUser = new User({ username, email, password: passwordDigest })

        newUser
          .save()
          .then(user => res.json({ token: signToken(user._id) }))
          .catch(err => next(err))
      }
      else res.status(400).json(errors)
    })
}

module.exports = { create }
