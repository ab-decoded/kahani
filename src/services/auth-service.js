import HttpStatus from 'http-status-codes'
import passport from '../lib/auth'

export default class AuthService {
  async login(ctx, next) {
    return passport.authenticate('local', (err, user) => {
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
        ctx.login(user)
        ctx.body = {
          success: true,
          message: 'Successfully authenticated',
          user: user
        }
      }
    })(ctx, next)
  }

  async logout(ctx, next) {
    ctx.logout()
    ctx.body = {
      success: true,
      message: 'Successfully logged out.'
    }
  }
}
