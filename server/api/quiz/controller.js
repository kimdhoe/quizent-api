const Quiz = require('./model')
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
      console.log(quizzes)
      res.json(quizzes)
    })
    .catch(err => {
      logError(err)
      next(err)
    })
}

const create = (req, res, next) => {
  const newQuiz = req.body

  newQuiz.author = req.user._id

  Quiz
    .create(newQuiz)
    .then(quiz => {
      Quiz.populate( quiz
                   , { path:   'author'
                     , select: { _id: 1, username: 1 }
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

module.exports = { index, create }
