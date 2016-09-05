const Quiz = require('./model')
const { logError } = require('../../util/logger')

const index = (req, res, next) => {
  Quiz
    .find()
    .exec()
    .then(quizzes => res.json(quizzes))
    .catch(err => next(err))
}

const create = (req, res, next) => {
  const newQuiz = req.body
  console.log(newQuiz)

  newQuiz.author = req.user._id

  Quiz
    .create(newQuiz)
    .then(quiz => res.json(quiz))
    .catch(err => {
      logError(err)
      next(err)
    })
}

module.exports = { index, create }
