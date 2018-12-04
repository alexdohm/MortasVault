const express = require('express')
const hbs = require('express-handlebars')
const app = express()

const path = require('path')
const PORT = process.env.PORT || 5000

/* Database Connection */
var pool = require('./dbcon.js')
app.set('pool', pool)

/* Body parser for post requests....not sure if i need this*/
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Set app engine to handlebars */
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/pages/',
    partialsDir: __dirname + '/views/partials/'
}))
app.set('view engine', 'hbs')


// app.set('views', path.join(__dirname, 'views'))

app.get('/', function(req, res) {
  res.render('./pages/home')
})

app.get('/Labels', function(req, res) {
  res.render('./pages/home')
  console.log("labels")
})

app.get('/Podcasts', function(req, res) {
  res.render('./pages/home')
  console.log("podcasts")
})

app.get('/Contact', function(req, res) {
  res.render('./pages/home')
  console.log("contact")
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

