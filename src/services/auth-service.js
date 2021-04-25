import HttpStatus from 'http-status-codes'
import passport from '../lib/auth'
import jwt from 'jsonwebtoken'
import { env } from '../lib/env'

const jwtConfig = {
  expiresIn: '1d',
  algorithm: 'HS256'
}

export default class AuthService {
  async login(ctx, next) {
    return passport.authenticate('login', async (err, user) => {
      try {
        if (err) {
          return next(err)
        }
        if (!user) {
          ctx.status = HttpStatus.UNAUTHORIZED
          ctx.body = {
            success: false,
            message: 'Invalid username or password.'
          }
        } else {
          await ctx.login(user, { session: false })

          const body = { _id: user._id, email: user.email }
          let sign = jwt.sign({ user: body }, env.JWT_SECRET, jwtConfig)
          const token = sign

          ctx.body = {
            success: true,
            message: 'Successfully authenticated',
            token
          }
        }
      } catch (err) {
        ctx.throw(500, err)
      }
    })(ctx, next)
  }

  async getUserDetails(ctx, next) {
    ctx.body = {
      user: ctx.state.user
    }
  }

  async logout(ctx, next) {
    ctx.logout()
    ctx.body = {
      success: true,
      message: 'Successfully logged out.'
    }
  }
}
