const mongoose = require('mongoose')

const Schema = mongoose.Schema

const QuizSchema =
  new Schema( { question: { type: String
                          , required: true
                          }
              , author: { type: Schema.Types.ObjectId, ref: 'user' }
              }
            , { timestamps: true }
            )

module.exports = mongoose.model('quiz', QuizSchema)
