//web sockets -> data communication b/w client and server
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 8000
var app = express()

//app.listen calls this in its backend
var server = http.createServer(app) 
  
// get back web socket server--> emit or listen to events
// communicate between server and clients 
var io = socketIO(server)
io.on('connection', (socket) => {
    console.log('New user connected')
    
    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})



//path provided to express  static middleware
// old way
//console.log(__dirname + '/../public')
//better way 
//console.log(publicPath)

//configure middleware 
app.use(express.static(publicPath))

/*****we will use http server instead of express server******/
// app.listen(port, () => {
//     console.log(`Server is up on ${port}`)
// })

server.listen(port, () => {
    console.log(`Server is up on ${port}`)
})