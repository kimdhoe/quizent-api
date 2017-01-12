const express = require('express')

const { decodeToken
      , getUser } = require('../../auth/auth')
const { show
      , checkLatestQuizzes
      , fetchLatestQuizzes
      , getFollowing
      , follow
      , unfollow } = require('./controller')

const router = express.Router()

router.get('/', decodeToken(), getUser(), show)

router.get('/check',  decodeToken(), getUser(), checkLatestQuizzes)
router.get('/latest', decodeToken(), getUser(), fetchLatestQuizzes)

router.get('/following', decodeToken(), getUser(), getFollowing)

router.post('/follow',   decodeToken(), getUser(), follow)
router.post('/unfollow', decodeToken(), getUser(), unfollow)

module.exports = router
