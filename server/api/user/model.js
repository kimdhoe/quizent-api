const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')
const random   = require('mongoose-simple-random')

const { logInfo } = require('../../util/logger')

const Schema = mongoose.Schema

const UserSchema = new Schema( { username:  { type:     String
                                            , required: true
                                            , unique:   true
                                            }
                               , fullname:  { type:     String
                                            , required: true
                                            }
                               , email:     { type:     String
                                            , required: true
                                            , unique:   true
                                            }
                               , password:  { type:     String
                                            , required: true
                                            }
                               , following: [ { type: Schema.Types.ObjectId
                                              , ref:  'user'
                                              }
                                            ]
                               }
                             , { timestamps: true }
                             )

UserSchema.plugin(random)

module.exports = mongoose.model('user', UserSchema)
