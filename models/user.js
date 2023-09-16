const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

/**
 * Schema for users
 */

const userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String,
  name: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  } ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

const User = model('User', userSchema)

module.exports = User