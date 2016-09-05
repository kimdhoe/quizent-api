const express = require('express')

const { verifyUser } = require('./auth')
const { login }      = require('./controller')

const router = express.Router()

router.post('/', verifyUser(), login)

module.exports = router
