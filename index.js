const express = require('express');
const hbs = require('express-handlebars');
const app = express();

const path = require('path');
const PORT = process.env.PORT || 5000;

/* Database Connection [heroku config update in .env for local running] */
const {Pool} = require('pg');
const pool = new Pool({
    // connectionString : process.env.configS,
    connectionString: 'postgres://idwaonghmolpnx:bb47386be50b1df44fd5642090f1c0e0dbc2c1b806cf6b49501fa11403353de4@ec2-174-129-41-12.compute-1.amazonaws.com:5432/dfaleqcti7lh58',
    ssl: true
});

/* Body parser for post requests */
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

/* Set app engine to handlebars */
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/pages/',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');

/* Home Page */
app.get('/', function (req, res) {
    res.render('./pages/home');
});

app.get('/Color-Scheme', function (req, res) {

});

/* Labels */
app.get('/Labels', async (req, res) => {

    let resultC = null;
    try {
        const clientTwo = await pool.connect();
        resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC;');
        clientTwo.release()
    } catch (err) {
        console.error(err);
        res.send("Error " + err)
    }

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT c.country_id AS id, label_name AS name, country_name AS country, label_bc AS bandcamp, \
       label_sc AS soundcloud, label_fb AS facebook, label_id AS labelid, avatar AS avatar\
       FROM labels \
       INNER JOIN countries c ON country_id = label_country \
       ORDER BY label_name ASC;');

        const results = {'label': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null};

        res.render('./pages/labels', results);
        client.release()
    } catch (err) {
        console.error(err);
        res.send("Error " + err)
    }
});

/* Labels Search */
app.post('/Label-Search', async (req, res) => {
    try {
        const client = await pool.connect();
        var query = "SELECT c.country_id AS id, label_name AS name, country_name AS country, label_bc AS bandcamp, \
    label_sc AS soundcloud, label_fb AS facebook, avatar AS avatar\
    FROM labels \
    INNER JOIN countries c ON country_id = label_country \
    WHERE label_name ILIKE '" + req.body.searchTerm + "%'\
    ORDER BY label_name ASC";

        const result = await client.query(query);
        let results = {'label': (result) ? result.rows : null};
        res.render('./partials/label-search', results, (err, html) => {
            if (err)
                return console.error(err);
            res.send(html);
        });
        client.release()
    } catch (err) {
        console.error(err);
        res.send("Error " + err)
    }
});

/* Labels Filter By Country */
app.post('/Label-Country', async (req, res) => {
    try {
        const client = await pool.connect();

        var query = 'SELECT c.country_id AS id, label_name AS name, country_name AS country, label_bc AS bandcamp, \
       label_sc AS soundcloud, label_fb AS facebook, avatar AS avatar\
       FROM labels \
       INNER JOIN countries c ON country_id = label_country \
       WHERE country_id = ' + req.body.searchTerm + ' \
       ORDER BY label_name ASC';

        const result = await client.query(query);

        let results = {'label': (result) ? result.rows : null};
        res.render('./partials/label-search', results, (err, html) => {
            if (err)
                return console.error(err);
            res.send(html);
        });
        client.release()
    } catch
        (err) {
        console.error(err);
        res.send("Error " + err)
    }
});

/* Podcasts */
app.get('/Podcasts', async (req, res) => {

    // Making these two variables global for the async promises
    result = null;
    resultC = null;

    try {
        const clientTwo = await pool.connect()
        resultC = await clientTwo.query('SELECT c.country_id AS id, c.country_name AS country \
       FROM countries c \
       ORDER BY country_name ASC');
        clientTwo.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err)
    }

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT podcast_name AS name, country_name AS country, podcast_sc AS soundcloud, \
       podcast_fb AS facebook, avatar AS avatar\
       FROM podcasts \
       INNER JOIN countries ON country_id = podcast_country \
       ORDER BY podcast_name ASC');

        results = {'podcast': (result) ? result.rows : null, 'countryL': (resultC) ? resultC.rows : null};
        res.render('./pages/podcasts', results);
        client.release()
    } catch (err) {
        console.error(err);
        res.send("Error " + err)
    }
});

/* Podcasts Search */
app.post('/Podcast-Search', async (req, res) => {
    try {
        const client = await pool.connect();
        var query = "SELECT podcast_name AS name, country_name AS country, podcast_sc AS soundcloud, \
       podcast_fb AS facebook, avatar AS avatar\
       FROM podcasts \
       INNER JOIN countries ON country_id = podcast_country \
       WHERE podcast_name ILIKE '" + req.body.searchTerm + "%'\
       ORDER BY podcast_name ASC";

        const result = await client.query(query);
        let results = {'podcast': (result) ? result.rows : null};
        res.render('./partials/podcast-search', results, (err, html) => {
            if (err)
                return console.error(err);
            res.send(html);
        });
        client.release()
    } catch (err) {
        console.error(err);
        res.send("Error " + err)
    }
});

/* Labels Filter By Country */
app.post('/Podcast-Country', async (req, res) => {
    try {
        const client = await pool.connect();

        var query = 'SELECT podcast_name AS name, country_name AS country, podcast_sc AS soundcloud, \
       podcast_fb AS facebook, avatar AS avatar\
       FROM podcasts \
       INNER JOIN countries ON country_id = podcast_country \
       WHERE country_id = ' + req.body.searchTerm + ' \
       ORDER BY podcast_name ASC';

        const result = await client.query(query);

        let results = {'podcast': (result) ? result.rows : null};
        res.render('./partials/podcast-search', results, (err, html) => {
            if (err)
                return console.error(err);
            res.send(html);
        });
        client.release()
    } catch (err) {
        console.error(err);
        res.send("Error " + err)
    }
});

// app.get('/About', function (req, res) {
//     res.render('./pages/about')
// });

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

