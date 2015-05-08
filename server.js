var express = require('express');
var session = require('express-session');
var morgan  = require('morgan');
var request = require('request');

var app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(session({
  secret:            'thisisnotverysecret',
  saveUninitialized: false,
  resave:            false
}));

app.use(express.static('./public'));

app.get('/', function(req, res) {
  res.render(
    'index',
    {link: 'https://github.com/login/oauth/authorize'}
  )
});

app.listen(9888, function() {
  console.log('Server running on port 9888...');
});