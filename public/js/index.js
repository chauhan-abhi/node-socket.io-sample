// init req from client to server to open a conncetion
var socket = io()
socket.on('connect', function() {
    console.log('Connected to server')  
    
    //create email event
    // socket.emit('createEmail', {
    //     to: 'abhi@ex.com',
    //     text: 'hey! this is abhi '       
    // })


    // socket.emit('createMessage', {
    //     from: "Abhi",
    //     text: 'Works for me'
    // })
})

socket.on('disconnect', function() {
    console.log('Disconnected from server')
})

// run some code when acknowleged arrives from server
// socket.emit('createMessage', {
//     from: 'PR',
//     text: 'Hi'
// }, function(data) {
//     console.log('Acknowledgement received', data)
// })

// custom  event handler from server
// data passed from server is provided here in callback function
// socket.on('newEmail', function(email) {
//     console.log('New Email', email)
// })




socket.on('newMessage', function(message) {
    console.log(message) 
    var li = jQuery('<li></li>') 

    li.text(`${message.from}: ${message.text}`)
    jQuery('#messages').append(li)
 
})

//listener
socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li></li>') 
    var a = jQuery('<a target="_blank">My current location</a>')
    li.text(`${message.from}: `)
    a.attr('href', message.url)
    li.append(a)
    jQuery('#messages').append(li)
})

//directly using jquery
jQuery("#message-form").on('submit', function(event) {
    event.preventDefault()
    socket.emit('createMessage', {
        from: 'User',
        //select input from name 
        text: jQuery('[name=message]').val()
    }, function() {

    })
})

//reusing jquery
var locationButton = jQuery('#send-location')
locationButton.on('click', function(){
    if(!navigator.geolocation) {
        return alert('Geolocatio not supported by your browser')
    }
    
    navigator.geolocation.getCurrentPosition(function(position) {
        //access given
        //success function -> emit event
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        alert('Unable to fetch location')
    })

})