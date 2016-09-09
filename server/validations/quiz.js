const validator = require('validator')
const isEmpty   = require('lodash/isEmpty')

module.exports = function validate ({ question, answer }) {
  const errors = {}
  const errorMessage = 'This field is require.'

  if (validator.isNull(question))
    errors.question = errorMessage

  if (validator.isNull(answer))
    errors.answer = errorMessage

  return { errors
         , isValid: isEmpty(errors)
         }
}
