import pEvent from 'p-event'
import { createServer } from '../lib/server'
import { env } from '../lib/env'
import { logger } from '../lib/logger'
import initialize from '../lib/app'

async function startServer() {
  let server
  try {
    const app = await initialize()
    server = await createServer(app)
    server.listen(env.PORT, () => {
      const mode = env.NODE_ENV
      logger.debug(`Server listening on ${env.PORT} in ${mode} mode`)
    })
    await pEvent(server, 'listening')

    await Promise.race([
      ...['SIGINT', 'SIGHUP', 'SIGTERM'].map(s =>
        pEvent(process, s, {
          rejectionEvents: ['uncaughtException', 'unhandledRejection']
        })
      )
    ])
  } catch (e) {
    logger.error(`Fatal error encountered: ${e}`)
  } finally {
    if (server) {
      await server.stop()
    }
    setTimeout(() => process.exit(), 10000).unref()
  }
}

;(async () => {
  await startServer()
})()
