const pick = require('lodash/pick')

const Quiz         = require('./model')
const validateQuiz = require('../../validations/quiz')
const { logError } = require('../../util/logger')

const index = (req, res, next) => {
  Quiz
    .find({ $or: [ { author: { $in: req.user.following } }
                 , { author: req.user }
                 ]
          }
         )
    .populate({ path:   'author'
              , select: { _id: 1, username: 1, fullname: 1 }
              }
             )
    .sort({ createdAt: -1 })
    .exec()
    .then(quizzes => {
      res.json(quizzes)
    })
    .catch(err => {
      logError(err)
      next(err)
    })
}

const create = (req, res, next) => {
  const quizData = pick(req.body, [ 'question', 'answer'])

  const { errors, isValid } = validateQuiz(quizData)

  if (isValid) {
    quizData.author = req.user._id

    Quiz
      .create(quizData)
      .then(quiz => {
        Quiz.populate( quiz
                    , { path:   'author'
                      , select: { _id: 1, username: 1, fullname: 1 }
                      }
                    )
          .then(quiz => {
            res.json(quiz)
          })
          .catch(err => {
            logError(err)
            next(err)
          })
      })
      .catch(err => {
        logError(err)
        next(err)
      })
  }
  else res.status(400).json({ errors })
}

module.exports = { index, create }
