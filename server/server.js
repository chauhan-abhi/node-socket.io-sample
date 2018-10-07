const path = require('path')
const express = require('express')
const port = process.env.PORT || 8000
const publicPath = path.join(__dirname, '../public')
var app = express()
//path provided to express  static middleware
// old way
//console.log(__dirname + '/../public')
//better way 
//console.log(publicPath)

app.use(express.static(publicPath))

app.get('/', (req, res) => {
    res.render('index.html')
})

app.listen(port, () => {
    console.log(`Server is up on ${port}`)
})