const express = require('express')

const { decodeToken
      , getUser } = require('../../auth/auth')
const { params
      , index
      , create
      , destroy
      , grade }   = require('./controller')

const router = express.Router()

const checkUser = [ decodeToken(), getUser() ]

router.param('id', params)

router.route('/')
  .get(checkUser, index)
  .post(checkUser, create)

router.route('/:id')
  .delete(checkUser, destroy)

router.route('/:id/submit')
  .post(grade)

module.exports = router
