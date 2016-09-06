const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')

const { logInfo } = require('../../util/logger')

const Schema = mongoose.Schema

const UserSchema = new Schema( { username: { type:     String
                                           , required: true
                                           , unique:   true
                                           }
                               , fullname: { type:     String
                                           , required: true
                                           , unique:   true
                                           }
                               , email:    { type:     String
                                           , required: true
                                           , unique:   true
                                           }
                               , password: { type:     String
                                           , required: true
                                           }

                               , following: [ { type: Schema.Types.ObjectId
                                              , ref:  'user'
                                              }
                                            ]
                               }
                             , { timestamps: true }
                             )

module.exports = mongoose.model('user', UserSchema)
