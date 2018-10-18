[{
    id: '/',
    name:'dsd',
    room: 'Room1'
}]

// Old way
// var users = []
// var addUser = (id, name, room) => {
//     users.push({})
// }
// module.exports = {addUser}


// ES6 classes
class Users {
   constructor() {
        this.users = []
   }
   
   addUser (id, name, room) {
       var user = {id, name, room}
       this.users.push(user)
       return user
   }

   removeUser (id) {
       // return user that was removed
       var user = this.getUser(id)
       if(user) {
           // create new array without the user with this id
           this.users = this.users.filter((user) => user.id !== id)
       }
       return user
   }
   
   getUser (id) {
       return this.users.filter((user) => user.id === id)[0]
   }

   getUserList (room) {
    //    var users = this.users.filter((user) => {
    //         // return true to keep ,false to remove
    //         return user.room === room
    //    })

        //ES6 shorthand
        var users = this.users.filter((user) => user.room ===room)
        var namesArray = users.map((user) => user.name)
        return namesArray

   }


}

module.exports = {Users}


