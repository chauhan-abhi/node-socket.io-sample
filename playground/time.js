// Jan 1 1970 00:00:00 am
var moment =  require('moment')

//newDate().getTime()
var someTimeStamp  = moment().valueOf()
console.log(someTimeStamp)
var createdAt = 1234
var date = moment(createdAt)
//date.add(1,'year').subtract(12, 'months')
console.log(date.format('MMM Do, YYYY'))
console.log(date.format('h:mm a'))