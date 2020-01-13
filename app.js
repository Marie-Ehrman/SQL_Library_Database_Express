//Initialized with Express Generator

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');
const books = require('./routes/books');


const app = express();

// Set the view engine to pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // provides access to the request body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// direct user to the books listing home page
app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
   
    // render the error page according to error
    switch (err.status) {
      case 400:
        res.render('books/no-book-id'); //if error is 400, render the no-book-id view
        break;
      case 404:
        res.render('books/page-not-found'); //if error is 404, render page-not-found view
        break;
      default:
        res.render('error'); //else render the error view
    }
});

module.exports = app;