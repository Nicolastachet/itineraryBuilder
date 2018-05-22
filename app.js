const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

// Express init
const app = express();

// Nunjucks Middleware
app.set('view engine', 'html');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// app.use(expressValidator());
// app.use(cookieParser());

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Database
// const {Pool, Client} = require('pg');
// var connectionString = "";
//
// const myPostgresStore = require('connect-pg-simple')(session);
const db = require('./db.js');


// Use of routes
var agency = require('./routes/activities');
app.use('/', agency);

var customers = require('./routes/customers');
app.use('/customer', customers);

var itinerary = require('./routes/itinerary');
app.use('/itinerary', itinerary);

var reports = require('./routes/reports');
app.use('/reports', reports);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Server
app.listen(5000, () => {
  console.log(`Server started on port 5000`);
});
