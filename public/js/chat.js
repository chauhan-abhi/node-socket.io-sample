// init req from client to server to open a conncetion
var socket = io()

function scrollToButtom() {
    // Selectors
    var messages = jQuery('#messages')
    var newMessage = messages.children('li:last-child')
    //Heights
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        //move to bottom of message area 
        messages.scrollTop(scrollHeight)
    }
}


socket.on('connect', function() {
    var parmas = jQuery.deparam(window.location.search)
    //emit join event by client to server .
    // when server listens to this its going to set of process of setting a room
    socket.emit('join', parmas, function(err) {
        if(err) {
           alert(err)
           //redirect to home page 
           window.location.href = "/" 
        } else {
            console.log('No error')
        }
    })
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


socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>')
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user))
    })
    jQuery('#users').html(ol)
})

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a') 
    //class name message-template is declared in index.html
    var template = jQuery('#message-template').html()
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })
    jQuery('#messages').append(html)
    scrollToButtom()
    // console.log(message) 
    // var formattedTime = moment(message.createdAt).format('h:mm a') 
    // var li = jQuery('<li></li>') 

    // li.text(`${message.from} ${formattedTime}: ${message.text}`)
    // jQuery('#messages').append(li)
 
})

//listener
socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a') 
    var template = jQuery('#location-message-template').html()
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    })
    jQuery("#messages").append(html)
    scrollToButtom()
    // var li = jQuery('<li></li>') 
    // var a = jQuery('<a target="_blank">My current location</a>')
    // li.text(`${message.from}  ${formattedTime}: `)
    // a.attr('href', message.url)
    // li.append(a)
    // jQuery('#messages').append(li)
})

//directly using jquery clickListener function
jQuery("#message-form").on('submit', function(event) {
    event.preventDefault()
    var messageTextBox = jQuery('[name=message]')
    socket.emit('createMessage', {
        //select input from name 
        text: messageTextBox.val()
    }, function () {
        //clear the text box value
        messageTextBox.val('')
    })
})

//reusing jquery
var locationButton = jQuery('#send-location')
locationButton.on('click', function(){
    if(!navigator.geolocation) {
        return alert('Geolocatio not supported by your browser')
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...')
    
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send location')
        //access given
        //success function -> emit event
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        locationButton.removeAttr('disabled').text('Send location')
        alert('Unable to fetch location')
    })

})