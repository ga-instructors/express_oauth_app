var express = require('express');
var session = require('express-session');
var morgan  = require('morgan');
var request = require('request');
var layout  = require('express-layout');

var app = express();

var GITHUB_OAUTH_ID     = process.env.GITHUB_OAUTH_ID;
var GITHUB_OAUTH_SECRET = process.env.GITHUB_OAUTH_SECRET;

app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.use(morgan('dev'));
app.use(session({
  secret:            'thisisnotverysecret',
  saveUninitialized: false,
  resave:            false
}));
app.use(layout());

app.use(express.static('./public'));

app.get('/', function(req, res) {
  var gitHubPath  = 'https://github.com/login/oauth/authorize';
  res.render('index', {gitHubOauthUrl: gitHubPath});
});

app.get('/oauth_callback', function(req, res) {
  res.redirect('/complete');
});

app.get('/complete', function(req, res) {
  res.render('complete', {
    name:  'User',
    email: 'user@unknown.org'
  });
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.listen(9888, function() {
  console.log('Server running on port 9888...');
  GITHUB_OAUTH_ID ? console.log('OAuth ID acquired!') : 
                    console.log('OAuth ID not in environment!');
  GITHUB_OAUTH_SECRET ? console.log('OAuth Secret acquired!') : 
                        console.log('OAuth Secret not in environment!');
});