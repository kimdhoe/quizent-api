const pick = require('lodash/pick')

const User         = require('../user/model')
const Quiz         = require('../quiz/model')
const { logError } = require('../../util/logger')

const show = (req, res) => {
  Quiz
    .find( { $or: [ { author: { $in: req.user.following } }
                  , { author: req.user }
                  ]
           }
         )
    .populate( { path:   'author'
               , select: { _id: 1, username: 1, fullname: 1 }
               }
             )
    .sort({ createdAt: -1 })
    .exec()
    .then(quizzes => {
      res.json( { me: pick( req.user
                          , [ '_id', 'username', 'fullname', 'createdAt' ]
                          )
                , quizzes
                }
              )
    })
    .catch(err => {
      logError(err)
      next(err)
    })
}

const getFollowing = (req, res) => {
  res.json({ following: req.user.following })
}

const follow = (req, res) => {
  User
    .findById(req.user._id)
    .then(user => {
      user.following.push(req.body.id)
      user
        .save()
        .then(() => res.json({ success: true }))
        .catch(err => {
          logError(err)
          res.status(500).json({ error: err })
        })
    })
    .catch(err => {
      logError(err)
      res.status(404).json({ error: err })
    })
}

const unfollow = (req, res) => {
  User
    .findById(req.user._id)
    .then(user => {
      user.following.remove(req.body.id)
      user
        .save()
        .then(user => res.json({ user }))
        .catch(err => {
          logError(err)
          res.status(500).json({ error: err })
        })
    })
    .catch(err => {
      logError(err)
      res.status(404).json({ error: err })
    })
}

module.exports = { show, getFollowing, follow, unfollow }
