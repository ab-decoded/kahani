'use strict'

import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from '../models/User'

// Set options to pass to Passport here
const options = {}

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id })
    .exec()
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err, null)
    })
})

passport.use(
  new LocalStrategy.Strategy(options, (username, password, done) => {
    User.findOne({ username: username })
      .exec()
      .then(user => {
        if (!user) return done(null, false)
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            throw err
          } else {
            if (isMatch) return done(null, user)
            else return done(null, false)
          }
        })
      })
      .catch(err => {
        return done(err)
      })
  })
)

export default passport
