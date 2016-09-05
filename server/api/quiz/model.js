const mongoose = require('mongoose')

const Schema = mongoose.Schema

const QuizSchema =
  new Schema( { question: { type: String
                          , required: true
                          }
              , author: { type: Schema.Types.ObjectId, ref: 'user' }
              }
            )

module.exports = mongoose.model('post', QuizSchema)
