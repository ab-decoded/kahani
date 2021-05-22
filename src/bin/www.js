import pEvent from 'p-event'
import WebSocket from 'ws'
import { createServer } from '../lib/server'
import { env } from '../lib/env'
import { logger } from '../lib/logger'
import initialize from '../lib/app'
import SessionEventsClientConnection from '../websockets/session-events-client-connection'

async function startServer() {
  let server, wsServer
  try {
    const app = await initialize()
    app.server = await createServer(app.callback())
    server = app.server
    app.server.listen(env.PORT, () => {
      const mode = env.NODE_ENV
      logger.debug(`Server listening on ${env.PORT} in ${mode} mode`)
    })
    await pEvent(app.server, 'listening')

    app.io = new WebSocket.Server({
      port: env.WS_PORT
    })
    wsServer = app.io
    new SessionEventsClientConnection(app.io).initialize()

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
    if (wsServer) {
      await wsServer.close()
    }
    setTimeout(() => process.exit(), 10000).unref()
  }
}

;(async () => {
  await startServer()
})()
