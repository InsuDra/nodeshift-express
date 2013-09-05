
var express = require('express');
var http = require('http');

/**
 * Grab the openshift ip and port for our 
 * public http server or default to localhost
 **/
var ip = process.env.OPENSHIFT_NODEJS_IP ||
         process.env.NODEJS_IP ||
         '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT ||
           process.env.NODEJS_PORT ||
           8080;

/**
 * Setup express and a basic middlesware
 * stack that includes custom error pages
 **/
var serv = express();
serv.set('views', './views');
serv.set('view engine', 'jade');

if (process.env.NODE_ENV === 'production'){
  serv.disable('debug');
} else {
  serv.enable('debug');
}

serv.use(serv.router);
serv.use(express.favicon());
serv.use(express.static('./public'));

serv.use(function (err, req, res, next) {
  console.error('Error: ' + err.message + ' - ' + req.url);
  console.error(err.stack);

  res.status(err.status || 500);
  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.render('page/error', {
      url: req.url,
      error: err
    });
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.json({
      error: err.message
    });
  } else {
    res.set('Content-Type', 'text/plain');
    res.send('Server Error');
  }
});

serv.use(function (req, res, next) {
  console.error('Error: Route not found. - ' + req.url);

  res.status(404);
  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.render('page/error', {
      url: req.url,
      error: { 
        status: 404,
        message: 'Route not found.',
      }
    });
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.json({
      error: err.message
    });
  } else {
    res.set('Content-Type', 'text/plain');
    res.send('404 - No content for ' + req.url);
  }
});

/**
 * Link our routes to the express server.
 **/
require('./routes/page').route(serv);

/**
 * Start http server with express
 **/
http.createServer(serv).listen(port, ip, function () {
  console.log('Log: Server started on ' + ip + ':' + port);
});
