const validator = require('validator')
const isEmpty   = require('lodash/isEmpty')

// Assume choices is a list of 'Non-Empty strings'.
const validate = ({ isShortAnswer, question, answer, choices }) => {
  const errors = {}
  const errorMessage = 'This field is required.'

  if (validator.isNull(question))
    errors.question = errorMessage

  if (validator.isNull(answer))
    errors.answer = errorMessage

  if (!isShortAnswer && isEmpty(choices)) {
    errors.choices = 'At least one choice is required.'
  }

  return { errors
         , isValid: isEmpty(errors)
         }
}

module.exports = validate
