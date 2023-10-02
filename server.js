const WebSocket = require('ws')
const http = require('http')

/* Create an HTTP server with a basic response */
const server = http.createServer((req, res) => {
  res.end('Chat server running')
})

/* Initialize WebSocket server and bind it to the HTTP server */
const wss = new WebSocket.Server({ server })

/* Handle incoming WebSocket connections */
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log('Message received from client', message.toString())
        // default message type is Buffer so we need to convert it to string
        client.send(message.toString())
      }
    })
  })
})

/* Start the HTTP server on port 3000 */
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
