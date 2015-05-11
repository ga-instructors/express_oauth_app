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
  if (req.session.access_token) {
    res.redirect('/complete');
    return;
  }

  var gitHubPath  = 'https://github.com/login/oauth/authorize';
  var redirectUrl = 'http://localhost:9888/oauth_callback';

  var gitHubOauthUrl = gitHubPath +
      '?client_id='    + GITHUB_OAUTH_ID +
      '&redirect_url=' + encodeURIComponent(redirectUrl);

  res.render('index', {gitHubOauthUrl: gitHubOauthUrl});
});

app.get('/oauth_callback', function(req, res) {
  var gitHubPath  = 'https://github.com/login/oauth/access_token';
  var redirectUrl = 'http://localhost:9888/oauth_callback';

  request({
    url:    gitHubPath,
    method: 'POST',
    json:   true,
    body:   {
      client_id:     GITHUB_OAUTH_ID,
      client_secret: GITHUB_OAUTH_SECRET,
      code:          req.query.code,
      redirect_uri:  redirectUrl
    }
  }, function(err, response, body) {
    req.session.access_token = body.access_token;
    res.redirect('/complete');
  });
});

app.get('/complete', function(req, res) {
  var access_token = req.session.access_token;

  if (!access_token) {
    res.redirect('/');
    return;
  }

  if (!req.session.name) {
    request({
      url:    'https://api.github.com/user',
      json:    true,
      headers: {
        'Authorization': 'token ' + access_token,
        'User-Agent':    'request'
      }
    }, function(err, response, body) {
      req.session.name  = body.name
      req.session.email = body.email

      res.render('complete', {
        name:  req.session.name,
        email: req.session.email
      });
    });
  } else {
    res.render('complete', {
      name:  req.session.name,
      email: req.session.email
    });
  }
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.listen(9888, function() {
  console.log('Server running on port 9888...');
});