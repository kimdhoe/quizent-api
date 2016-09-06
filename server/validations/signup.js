const validator = require('validator')
const isEmpty   = require('lodash/isEmpty')

const validate = ({ username, fullname, email, password, passwordConfirmation }) => {
  const errors = {}

  if (validator.isNull(username))
    errors.username = 'This field is required.'

  if (validator.isNull(fullname))
    errors.fullname = 'This field is required.'

  if (!validator.isEmail(email))
    errors.email = 'Invalid email address.'

  if (validator.isNull(email))
    errors.email = 'This field is required.'

  if (validator.isNull(password))
    errors.password = 'This field is required.'

  if (validator.isNull(passwordConfirmation))
    errors.passwordConfirmation = 'This field is required.'

  if (!validator.equals(password, passwordConfirmation))
    errors.passwordConfirmation = 'Passwords must match.'

  return { errors
         , isValid: isEmpty(errors)
         }
}

module.exports = validate
