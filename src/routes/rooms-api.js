import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = roomService => ({
  getRoom: async ctx => ctx.ok(await roomService.get(ctx.params.id)),
  createRoom: async ctx =>
    ctx.created(await roomService.create(ctx.request.body)),
  updateRoom: async ctx =>
    ctx.ok(await roomService.update(ctx.params.id, ctx.request.body)),
  deleteRoom: async ctx =>
    ctx.noContent(await roomService.remove(ctx.params.id))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/room')
  .get('/:id', 'getRoom')
  .post('', 'createRoom')
  .patch('/:id', 'updateRoom')
  .delete('/:id', 'deleteRoom')
