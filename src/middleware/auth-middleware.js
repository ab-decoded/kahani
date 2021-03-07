import * as http from 'http'

export default async function authenticate(ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.status = 401
    throw new Error(http.STATUS_CODES['401'])
  }
}
