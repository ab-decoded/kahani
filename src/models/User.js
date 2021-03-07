import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import UserRole from '../domain/UserRole'

var SALT_WORK_FACTOR = 10

// Schema

const nameSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    }
  },
  { _id: false }
)

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: nameSchema
  },
  role: {
    type: UserRole,
    required: true
  }
})

userSchema.pre('save', function(next) {
  const user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  try {
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
    user.password = bcrypt.hashSync(user.password, salt)
    next()
  } catch (error) {
    return next(error)
  }
})

userSchema.pre('findOneAndUpdate', async function(next) {
  const password = this.getUpdate().password
  if (!password) {
    return next()
  }
  try {
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
    this.getUpdate().password = bcrypt.hashSync(password, salt)
    next()
  } catch (error) {
    return next(error)
  }
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.fullName = function() {
  return this.name.firstName + ' ' + this.name.lastName
}

userSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) => {
    delete ret.password
    return ret
  }
})

export default mongoose.model('User', userSchema)
