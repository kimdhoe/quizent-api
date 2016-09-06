const User         = require('../user/model')
const { logError } = require('../../util/logger')

const show = (req, res) => {
  res.json({ user: req.user })
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
