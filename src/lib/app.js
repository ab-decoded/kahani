import Koa from 'koa'
import session from 'koa-session'
import helmet from 'koa-helmet'
import { configureContainer } from './container'
import { errorHandler } from '../middleware/error-handler'
import compress from 'koa-compress'
import respond from 'koa-respond'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { loadControllers, scopePerRequest } from 'awilix-koa'
import { registerContext } from '../middleware/register-context'
import { notFoundHandler } from '../middleware/not-found'
import { bootstrapDatabase, connectToDatabase } from './database'
import passport from './auth'
import { env } from './env'
import { logger } from './logger'

export default async function initialize() {
  const app = new Koa()

  app.keys = [env.SECRET]

  // Container is configured with our services and whatnot.
  const container = (app.container = configureContainer())
  app
    // Top middleware is the error handler.
    .use(errorHandler)
    // Allow app to maintain sessions
    .use(session({}, app))
    // Provide important security headers by default
    .use(helmet())
    // Compress all responses.
    .use(compress())
    // Adds ctx.ok(), ctx.notFound(), etc..
    .use(respond())
    // Handles CORS.
    .use(cors())
    // Parses request bodies.
    .use(bodyParser())
    // Creates an Awilix scope per request. Check out the awilix-koa
    // docs for details: https://github.com/jeffijoe/awilix-koa
    .use(scopePerRequest(container))
    // Use Passport authorization
    .use(passport.initialize())
    .use(passport.session())
    // Create a middleware to add request-specific data to the scope.
    .use(registerContext)
    // Load routes (API "controllers")
    .use(loadControllers('../routes/*.js', { cwd: __dirname }))
    // Default handler when nothing stopped the chain.
    .use(notFoundHandler)

  // Load database config
  await connectToDatabase(
    env.DB_HOST,
    env.DB_PORT,
    env.DB_DATABASE,
    env.DB_AUTHENTICATE,
    env.DB_USERNAME,
    env.DB_PASSWORD
  )
  logger.info(
    `Successfully connected to database: ${env.DB_HOST}:${env.DB_PORT}/${
      env.DB_DATABASE
    }`
  )

  // Bootstrap database
  await bootstrapDatabase()
  logger.info('Successfully bootstrapped users to database')

  return app
}
