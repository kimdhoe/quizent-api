const express = require('express')

const userRouter      = require('./user/router')
const quizRouter      = require('./quiz/router')
const meRouter        = require('./me/router')

const router = express.Router()

router.use('/users',     userRouter)
router.use('/quizzes',   quizRouter)
router.use('/me',        meRouter)

module.exports = router
