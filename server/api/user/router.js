const express = require('express')

const { decodeToken, getUser, getMe }             = require('../../auth/auth')
const { params, index, create, show, latestQuizzes
  , checkLatestQuizzes } = require('./controller')

const router = express.Router()

router.param('username', params)

router.route('/')
  .get(decodeToken(), getUser(), index)
  .post(create)

router.route('/:username')
  .get(getMe(), show)

router.route('/:username/check')
  .get(getMe(), checkLatestQuizzes)

router.route('/:username/latest')
  .get(getMe(), latestQuizzes)

module.exports = router
