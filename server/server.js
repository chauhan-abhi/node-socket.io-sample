//web sockets -> data communication b/w client and server
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')

//path provided to express  static middleware
// old way
//console.log(__dirname + '/../public')
//better way 
//console.log(publicPath)
//prevent from first going into server directory then going out and then to public
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 8000
var app = express()
//app.listen calls this in its backend
var server = http.createServer(app) 
// get back web socket server--> emit or listen to events
// communicate between server and clients 
var io = socketIO(server)
var users = new Users()
//configure middleware 
app.use(express.static(publicPath))

io.on('connection', (socket) => {
     console.log('New user connected')

    //emit function can be used on both client and server
    /******* emit message to single connection ***************/
    // socket.emit('newMessage', {
    //     from: 'ABHISSS',
    //     text: 'See u',
    //     completedAt: 1234
    // })

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required')
        } 

        // target specific users
        socket.join(params.room)
        //remove user from previous potential rooms and add them to new rooms
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)
        // emit event to everyone in chat room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))


        //socket.leave('THE OFFICE')

        // io.emit               --> io.to(roomName).emit
        // socket.broadcast.emit --> socket.broadcast.to(roomName).emit
        // socket.emit

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the CHAT App'))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`))
        callback()
    })


    // data in event from client to server
    // listen to create Message
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id)
        if(user && isRealString(message.text)) {
             /********emit event to every single person in room **********/
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))

        }
        /********emit event to every single connection **********/
        //io.emit('newMessage', generateMessage(message.from, message.text))
        /***send acknowledgement to server-> can send data objects also *********/
        callback()
    })

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id)
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))

        }
    })
    
    socket.on('disconnect', () => {
        console.log('User was disconnected')
        // remove the user who leaves the remove
        var user = users.removeUser(socket.id)
        if(user) {
            //update user list
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))      
            //user left message
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))  
        }
    })
})


// app.listen(port, () => {
//     console.log(`Server is up on ${port}`)
// })
/*****we will use http server instead of express server******/
server.listen(port, () => {
    console.log(`Server is up on ${port}`)
})