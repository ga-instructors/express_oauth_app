var express = require('express');
var session = require('express-session');
var morgan  = require('morgan');
var request = require('request');

var app = express();

var GITHUB_OAUTH_ID     = process.env.GITHUB_OAUTH_ID
var GITHUB_OAUTH_SECRET = process.env.GITHUB_OAUTH_SECRET

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(session({
  secret:            'thisisnotverysecret',
  saveUninitialized: false,
  resave:            false
}));

app.use(express.static('./public'));

app.get('/', function(req, res) {
  var gitHubPath  = 'https://github.com/login/oauth/authorize'
  var redirectUrl = 'http://localhost:9888/oauth_callback'

  var gitHubOauthUrl = gitHubPath +
      '?client_id=' + encodeURIComponent(GITHUB_OAUTH_ID) +
      '&redirect_url=' + encodeURIComponent(redirectUrl)

  res.render('index', {gitHubOauthUrl: gitHubOauthUrl})
});

app.listen(9888, function() {
  console.log('Server running on port 9888...');
});