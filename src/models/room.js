import mongoose, { Schema } from 'mongoose'
import { ObjectId } from 'bson'

// Schema
const roomSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  name: {
    type: String,
    required: false
  },
  metadata: {
    type: Object,
    required: false
  },
  createdByUserId: {
    type: ObjectId,
    required: false
  },
  participants: {
    type: Array(String),
    required: false
  }
})

export default mongoose.model('Room', roomSchema)
