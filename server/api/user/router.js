const express = require('express')

const { decodeToken, getUser } = require('../../auth/auth')
const { index, create }        = require('./controller')

const router = express.Router()

router.route('/')
  .get(decodeToken(), getUser(), index)
  .post(create)

module.exports = router
