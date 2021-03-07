'use strict'

import mongoose from 'mongoose'
import User from '../models/User'
import { logger } from './logger'
import { env } from './env'
import UserRole from '../domain/UserRole'

const connectToDatabase = async (
  databaseHostName,
  databasePort,
  databaseName,
  shouldAuthenticate,
  username,
  password
) => {
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)
  mongoose.set('useUnifiedTopology', true)
  const options = { useNewUrlParser: true }
  if (shouldAuthenticate) {
    await mongoose.connect(
      'mongodb://' +
        username +
        ':' +
        password +
        '@' +
        databaseHostName +
        ':' +
        databasePort +
        '/' +
        databaseName,
      options
    )
  } else {
    await mongoose.connect(
      'mongodb://' + databaseHostName + ':' + databasePort + '/' + databaseName,
      options
    )
  }
}

const bootstrapDatabase = async () => {
  const users = [
    {
      username: env.ADMIN_USERNAME,
      password: env.ADMIN_PASSWORD,
      name: {
        firstName: 'Abhinav',
        lastName: 'Bansal'
      },
      role: UserRole.ADMIN
    }
  ]

  logger.info('Bootstrapping users to database')
  try {
    await upsertAllUsers(users)
  } catch (e) {
    throw e
  }
}

const upsertAllUsers = async users => {
  for (const user of users) {
    await User.findOneAndUpdate({ username: user.username }, user, {
      upsert: true,
      overwrite: true
    })
  }
}

export { connectToDatabase, bootstrapDatabase }
