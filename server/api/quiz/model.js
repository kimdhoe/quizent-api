const mongoose = require('mongoose')

const Schema = mongoose.Schema

// !!!
// add answer
// - multiple-choice
// - short-answer
//
// question
// choices: [{type: String}]
// answer: { type: String, required: true }
//
// route:
// submit
// POST /api/quizzes/:id
// { answer: 'correct answer goes here'
// , explanation: string or array-of string??? split stirng submitted by
// newline.
//                                              each string becomes a paragraph
// }
const QuizSchema =
  new Schema( { isShortAnswer: { type:     Boolean
                               , required: true
                               }
              , question:      { type:     String
                               , required: true
                               }
              , answer:        { type:     String
                               , required: true
                               }
              , choices:       [{ type: String }]
              , author:        { type: Schema.Types.ObjectId
                               , ref:  'user'
                               }
              }
            , { timestamps: true }
            )

module.exports = mongoose.model('quiz', QuizSchema)
