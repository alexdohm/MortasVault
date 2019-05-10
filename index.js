const express = require('express')
const hbs = require('express-handlebars')
const app = express()

const path = require('path')
const PORT = process.env.PORT || 5000

/* Database Connection [heroku config update in .env for local running] */
const { Pool } = require('pg')
const pool = new Pool({
  connectionString : process.env.configS,
  ssl : true
})

/* Body parser for post requests */
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Set app engine to handlebars */
app.use(express.static(path.join(__dirname, '/public')))
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

/* Test Home Page */
app.get('/beta', function(req, res) {
  res.render('./pages/homeBeta')
})

/* Labels */
app.get('/Labels', async (req, res) => {

  // Making these two variables global for the async promises
  result = null
  resultC = null

  try {
    const clientTwo = await pool.connect()
    resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC;')
    clientTwo.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT c.country_id AS id, label_name AS name, country_name AS country, label_bc AS bandcamp, \
       label_sc AS soundcloud, label_fb AS facebook\
       FROM labels \
       INNER JOIN countries c ON country_id = label_country \
       ORDER BY label_name ASC;')

    results = { 'label': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null }
    res.render('./pages/labels', results )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})

/* Filter Labels by Country */
app.get('/Labels/filter/:country', async (req, res) => {

  // Making these two variables global for the async promises
  result = null
  resultC = null

  try {
    const clientTwo = await pool.connect()
    resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC;')
    clientTwo.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }

  try {
    const client = await pool.connect()
    var query = 'SELECT c.country_id AS id, label_name AS name, country_name AS country, label_bc AS bandcamp, \
       label_sc AS soundcloud, label_fb AS facebook\
       FROM labels \
       INNER JOIN countries c ON country_id = label_country \
       WHERE country_id = $1 \
       ORDER BY label_name ASC;'
    var insert = req.params.country
    const result = await client.query(query, [insert])

    results = { 'label': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null, 'countryS': req.params.country }
    res.render('./pages/labels', results )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})


/* Labels Search */
app.get('/Labels/search/:s', async (req, res) => {

  // Making these two variables global for the async promises
  result = null
  resultC = null

  try {
    const clientTwo = await pool.connect()
    resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC;')
    clientTwo.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }

  try {
    const client = await pool.connect()
    var query = 'SELECT c.country_id AS id, label_name AS name, country_name AS country, label_bc AS bandcamp, \
    label_sc AS soundcloud, label_fb AS facebook\
    FROM labels \
    INNER JOIN countries c ON country_id = label_country \
    WHERE label_name ILIKE $1' ;

    var insert = req.params.s + '%'
    const result = await client.query(query, [insert])

    newr = { 'label': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null }
    res.render('./pages/labels', newr )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})

/* Podcasts */
app.get('/Podcasts', async (req, res) => {

  // Making these two variables global for the async promises
  result = null
  resultC = null

  try {
    const clientTwo = await pool.connect()
    resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC;')
    clientTwo.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT podcast_name AS name, country_name AS country, podcast_sc AS soundcloud, \
       podcast_fb AS facebook\
       FROM podcasts \
       INNER JOIN countries ON country_id = podcast_country \
       ORDER BY podcast_name ASC;')

    results = { 'podcast': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null }
    res.render('./pages/podcasts', results )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})

/* Filter Podcasts by Country */
app.get('/Podcasts/filter/:country', async (req, res) => {

  // Making these two variables global for the async promises
  result = null
  resultC = null

  try {
    const clientTwo = await pool.connect()
    resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC;')
    clientTwo.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }

  try {
    const client = await pool.connect()
    var query = 'SELECT podcast_name AS name, country_name AS country, podcast_sc AS soundcloud, \
       podcast_fb AS facebook\
       FROM podcasts \
       INNER JOIN countries ON country_id = podcast_country \
       WHERE country_id = $1 \
       ORDER BY podcast_name ASC;'
    var insert = req.params.country
    const result = await client.query(query, [insert])

    results = { 'podcast': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null, 'countryS': req.params.country }
    res.render('./pages/podcasts', results )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})

/* Podcasts Search */
app.get('/Podcasts/search/:s', async (req, res) => {

  // Making these two variables global for the async promises
  result = null
  resultC = null

  try {
    const clientTwo = await pool.connect()
    resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC;')
    clientTwo.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }

  try {
    const client = await pool.connect()
    var query = 'SELECT podcast_name AS name, country_name AS country, podcast_sc AS soundcloud, \
       podcast_fb AS facebook\
       FROM podcasts \
       INNER JOIN countries ON country_id = podcast_country \
       WHERE podcast_name ILIKE $1 \
       ORDER BY podcast_name ASC' ;

    var insert = req.params.s + '%'
    const result = await client.query(query, [insert])

    newr = { 'podcast': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null }
    res.render('./pages/podcasts', newr )
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})


app.get('/About', function(req, res) {
  res.render('./pages/about')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

