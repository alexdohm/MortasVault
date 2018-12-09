const express = require('express')
const hbs = require('express-handlebars')
const app = express()

const path = require('path')
const PORT = process.env.PORT || 5000

let pg = require('pg')
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true
}

/* Database Connection [heroku config opdate in .env for local running] */
const { Pool } = require('pg')
const pool = new Pool({
  connectionString : process.env.configS,
  ssl : true
})

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

/* Home Page */
app.get('/', function(req, res) {
  res.render('./pages/home')
})

/* Labels */
app.get('/Labels', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT label_name AS name, country_name AS country, label_bc AS bandcamp, \
       label_sc AS soundcloud, label_fb AS facebook\
       FROM labels \
       INNER JOIN countries ON country_id = label_country \
       ORDER BY label_name DESC;')

    const results = { 'label': (result) ? result.rows : null}
    res.render('./pages/labels', results )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})

/* Podcasts */
app.get('/Podcasts', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT podcast_name AS name, country_name AS country, podcast_sc AS soundcloud, \
       podcast_fb AS facebook\
       FROM podcasts \
       INNER JOIN countries ON country_id = podcast_country \
       ORDER BY podcast_name DESC;')

    const results = { 'podcast': (result) ? result.rows : null}
    res.render('./pages/podcasts', results )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})

app.get('/Contact', function(req, res) {
  res.render('./pages/home')
  console.log("contact")
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

