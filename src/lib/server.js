import * as http from 'http'
import stoppable from 'stoppable'
import util from 'util'

import { logger } from './logger'

/**
 * Creates and returns a new Koa application.
 * Does *NOT* call `listen`!
 *
 * @return {Promise<http.Server>} The configured app.
 */
export async function createServer(app) {
  logger.debug('Creating server...')

  // Creates a http server ready to listen.
  const server = stoppable(http.createServer(app.callback()))
  server.stop = util.promisify(server.stop)

  // Add a `close` event listener so we can clean up resources.
  server.on('close', () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Server closing, bye!')
  })

  logger.debug('Server created, ready to listen', { scope: 'startup' })
  return server
}
