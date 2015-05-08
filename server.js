var express = require('express');
var session = require('express-session');
var morgan  = require('morgan');
var request = require('request');

var app = express();

app.use(morgan('dev'));
app.use(session({
  secret:            'thisisnotverysecret',
  saveUninitialized: false,
  resave:            false
}));

app.use(express.static('./public'));

app.listen(9888, function() {
  console.log('Server running on port 9888...');
});