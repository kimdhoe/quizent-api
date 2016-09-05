const express = require('express')

const { decodeToken
       , getUser } = require('../../auth/auth')
const { show }     = require('./controller')

const router = express.Router()

router.get('/', decodeToken(), getUser(), show)

module.exports = router
