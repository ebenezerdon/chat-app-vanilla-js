const WebSocket = require('ws')
const http = require('http')

/* Create an HTTP server with a basic response */
const server = http.createServer((req, res) => {
  res.end('Chat server running')
})

/* Initialize WebSocket server and bind it to the HTTP server */
const wss = new WebSocket.Server({ server })

// Map to store chatCode and corresponding WebSocket clients
const chatRooms = new Map()

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { sender, text, timestamp, chatCode } = JSON.parse(message.toString())

    // Associate new client with chatCode
    if (!chatRooms.has(chatCode)) {
      chatRooms.set(chatCode, new Set())
    }
    chatRooms.get(chatCode).add(ws)

    // Broadcast message to clients with the same chatCode
    const targetClients = chatRooms.get(chatCode)
    if (targetClients) {
      targetClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ sender, text, timestamp, chatCode }))
        }
      })
    }
  })
})

/* Start the HTTP server on port 3000 */
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
