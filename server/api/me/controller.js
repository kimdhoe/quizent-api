const show = (req, res) => {
  res.json({ user: req.user })
}

module.exports = { show }
