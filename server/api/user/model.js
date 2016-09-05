const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')

const { logInfo } = require('../../util/logger')

const Schema = mongoose.Schema

const UserSchema = new Schema( { username: { type:     String
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
                               }
                             , { timestamps: true }
                             )

module.exports = mongoose.model('user', UserSchema)
