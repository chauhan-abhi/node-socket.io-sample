// init req from client to server to open a conncetion
var socket = io()
socket.on('connect', function() {
    console.log('Connected to server')  
    
    //create email event
    // socket.emit('createEmail', {
    //     to: 'abhi@ex.com',
    //     text: 'hey! this is abhi '       
    // })


    socket.emit('createMessage', {
        from: "Abhi",
        text: 'Works for me'
    })
})

socket.on('disconnect', function() {
    console.log('Disconnected from server')
})

socket.on('newMessage', function(message) {
    console.log(message)   
})

// custom  event handler from server
// data passed from server is provided here in callback function
// socket.on('newEmail', function(email) {
//     console.log('New Email', email)
// })