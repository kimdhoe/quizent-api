const express = require('express')

const { decodeToken, getUser, getMe } = require('../../auth/auth')
const { params, index, create, show }  = require('./controller')

const router = express.Router()

router.param('username', params)

router.route('/')
  .get(decodeToken(), getUser(), index)
  .post(create)

router.route('/:username')
  .get(getMe(), show)

module.exports = router
