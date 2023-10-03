const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()

/* Serve static files from the root directory */
app.use(express.static(__dirname))

/* Route to serve HTML file from root directory */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

/* Route to indicate chat server is running */
app.get('/server', (req, res) => {
  res.send('Chat server running')
})

/* Create an HTTP server with Express app */
const server = http.createServer(app)

/* Initialize WebSocket server and bind it to the HTTP server */
const wss = new WebSocket.Server({ server })

/* Map to store chatCode and corresponding WebSocket clients */
const chatRooms = {}

/* Handle WebSocket connections */
wss.on('connection', (ws) => {
  /* Handle incoming messages */
  ws.on('message', (message) => {
    const messageObject = JSON.parse(message.toString())
    const { type, chatCode } = messageObject

    if (type === 'join') {
      /* Create a new chat room if it doesn't exist */
      chatRooms[chatCode] = chatRooms[chatCode] || new Set()
      return chatRooms[chatCode].add(ws)
    }

    /* Broadcast message to clients with the same chatCode */
    const targetClients = chatRooms[chatCode]
    targetClients?.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageObject))
      }
    })
  })
})

/* Start the HTTP server on port 3000 */
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
