const express = require('express')

const { decodeToken, getUser } = require('../../auth/auth')
const { index, create } = require('./controller')

const router = express.Router()

const checkuser = [ decodeToken(), getUser() ]

router.route('/')
  .get(index)
  .post(checkuser, create)

module.exports = router
