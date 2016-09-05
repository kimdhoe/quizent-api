const { signToken } = require('./auth')

const login = (req, res) => {
  const token = signToken(req.user._id)

  res.json({ token
           , username: req.user.username
           }
          )
}

module.exports = { login }
