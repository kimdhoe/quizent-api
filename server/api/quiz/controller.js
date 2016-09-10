const pick = require('lodash/pick')

const Quiz         = require('./model')
const validateQuiz = require('../../validations/quiz')
const { logError } = require('../../util/logger')

const params = (req, res, next, id) => {
  Quiz.findById(id)
    .select('answer')
    .exec()
    .then(quiz => {
      console.log(quiz)
      if (!quiz)
        next(new Error('No quiz with that id'))
      else {
        req.quiz = quiz
        next()
      }
    })
    .catch(err => {
      legError(err)
      next(err)
    })
}

// !!!
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

// Creates a new quiz.
const create = (req, res, next) => {
  const { isShortAnswer, question, answer, choices } = req.body

  const quizData = pick(req.body, [ 'isShortAnswer', 'question', 'answer' ])

  quizData.choices = isShortAnswer
                       ? []
                       : req.body.choices
                           .map(choice => choice.trim())
                           .filter(choice => choice)

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
            res.json(pick( quiz
                         , ['isShortAnswer', 'question', 'choices', '_id', 'author', 'createdAt'])
                         )
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

// Determines whether a submitted answer is correct.
const grade = (req, res, next) => {
  res.json({ grade: { isCorrect: req.quiz.answer === req.body.answer.trim() } })
}

module.exports = { params, index, create, grade }
