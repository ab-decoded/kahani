'use strict'

import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import JWTStrategy from 'passport-jwt'
import User from '../models/User'
import { env } from './env'

// Set options to pass to Passport here
const options = {
  usernameField: 'username',
  passwordField: 'password'
}

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
  'login',
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

passport.use(
  new JWTStrategy.Strategy(
    {
      secretOrKey: env.JWT_SECRET,
      jwtFromRequest: JWTStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        const user = await User.findOne({ _id: token.user._id })
        return done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

export default passport
