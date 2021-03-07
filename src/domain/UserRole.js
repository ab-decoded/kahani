import UserOperation from './UserOperation'

export default {
  ADMIN: {
    id: 'ADMIN',
    rights: [UserOperation.ADMIN]
  },
  READONLY: {
    id: 'READONLY',
    rights: [UserOperation.READ]
  }
}
