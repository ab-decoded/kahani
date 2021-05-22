import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data => pick(data, ['id'])

/**
 * Room Service.
 * Gets a room store injected.
 */
export default class RoomService {
  constructor(roomStore) {
    this.roomStore = roomStore
  }

  async find(params) {
    return this.roomStore.find(params)
  }

  async get(id) {
    assertId(id)
    return this.roomStore
      .get(id)
      .then(NotFound.makeAssert(`Todo with id "${id}" not found`))
  }

  async create(data) {
    BadRequest.assert(data, 'No room payload given')
    BadRequest.assert(data.id, 'Room ID is required')
    BadRequest.assert(data.id.length < 50, 'Room ID is too long')
    return this.roomStore.create(pickProps(data))
  }

  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No todo payload given')

    await this.get(id)

    const picked = pickProps(data)
    return this.roomStore.update(id, picked)
  }

  async remove(id) {
    await this.get(id)
    return this.roomStore.remove(id)
  }
}
