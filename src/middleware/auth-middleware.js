import * as http from 'http'
import passport from 'koa-passport'

const _promisifiedPassportAuthentication = (ctx, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return reject(err)
      }
      if (!user) {
        return reject(new Error('User not authenitcated'))
      }
      return resolve(user)
    })(ctx, next)
  })
}

export default async function authenticate(ctx, next) {
  try {
    ctx.state.user = await _promisifiedPassportAuthentication(ctx, next)
    next()
  } catch (err) {
    ctx.throw(401, http.STATUS_CODES['401'])
  }
}
