import UserOperation from './user-operation'

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
