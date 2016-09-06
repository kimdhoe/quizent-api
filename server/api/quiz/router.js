const express = require('express')

const { decodeToken, getUser } = require('../../auth/auth')
const { index, create }        = require('./controller')

const router = express.Router()

const checkUser = [ decodeToken(), getUser() ]

router.route('/')
  .get(checkUser, index)
  .post(checkUser, create)

module.exports = router
