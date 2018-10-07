//web sockets -> data communication b/w client and server
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

//prevent from first going into server directory then going out and then to public
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

    //emit function can be used on both client and server
    // socket.emit('newEmail', {
    //     from: 'shubham@gmail.com',
    //     text: 'Hey! Whats going on'
    // })

    /******* emit message to single connection ***************/
    // socket.emit('newMessage', {
    //     from: 'ABHISSS',
    //     text: 'See u',
    //     completedAt: 1234
    // })

    // data in event from client to server
    // socket.on('createEmail', (newEmail) => {
    //     console.log(newEmail)
    // })

    // listen to create Message
    socket.on('createMessage', (message) => {
        console.log('createMessage', message)
        //emit event to every single connection
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()    
        })

    })
    
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