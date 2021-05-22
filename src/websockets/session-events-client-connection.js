import { setupWSConnection } from 'y-websocket/bin/utils'

export default class SessionEventsClientConnection {
  constructor(io) {
    this.io = io
  }

  initialize() {
    this.io.on('connection', (ws, request, client) => {
      console.log('Client connection found!!!')

      setupWSConnection(ws, request)

      ws.on('message', function message(msg) {
        console.log(`Received message ${msg} from user ${client}`)
      })

      ws.on('close', () => {
        console.log('Connection disconnected!')
      })
    })
  }
}
