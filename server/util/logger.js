const config     = require('../config')
const { cyan
      , green
      , red
      , yellow } = require('colors')

// Given an array, console-logs the elements.
const logXs = xs => console.log(...xs)

const consoleLog = config.shouldLog ? logXs : () => {}

// Logs colorful messages with a tag prefixed.
const logInfo = (...xs) => {
  const tag = green('[* LOG *]')

  const format = x =>
    typeof x === 'object'
      ? `${tag}  ${cyan(JSON.stringify(x, null, 2))}`
      : `${tag}  ${cyan(x)}`

  consoleLog(xs.map(format))
}

// Logs colorful error messages with a tag prefixed.
const logError = (...es) => {
  const format = e => {
    e          = e.stack || e
    const name = e.name  || 'ERR'
    const tag  = yellow(`[* ${name} *]`)

    return `${tag}  ${red(e)}`
  }

  consoleLog(es.map(format))
}

module.exports = { logInfo, logError }
