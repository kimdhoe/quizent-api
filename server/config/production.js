const prodConfig = { shouldLog: false
                   , morgan: 'combined'
                   , db: { url: process.env.DB_URI }
                   }

module.exports = prodConfig
