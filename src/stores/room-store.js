import Room from '../models/room'

export default function createRoomStore(logger) {
  return {
    async get(id) {
      logger.debug(`Getting room with id ${id}`)
      const room = await Room.findOne({ id }).exec()
      if (!room) {
        return null
      }
      return room
    },

    async create(data) {
      const roomData = {
        ...data
      }
      const room = await Room.create(roomData)
      logger.debug(`Created new room`, room)
      return room
    },

    async update(id, data) {
      const room = await Room.findOneAndUpdate({ id }, data).exec()
      logger.debug(`Updated todo ${id}`, room)
      return room
    },

    async remove(id) {
      await Room.deleteOne({ id }).exec()
      logger.debug(`Removed todo ${id}`)
    }
  }
}
