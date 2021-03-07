import { createController } from 'awilix-koa'
import authenticate from '../middleware/auth-middleware'

const api = authService => ({
  login: async (ctx, next) => authService.login(ctx, next),
  logout: async (ctx, next) => authService.logout(ctx, next)
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/auth')
  .post('/login', 'login')
  .get('/logout', 'logout', {
    before: [authenticate]
  })
