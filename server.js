
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

/**
 * Add favicon and static files to stack
 */
serv.use(express.favicon());
serv.use(express.static('./public'));

/**
 * Init the request with global info, this
 * would be the place to manage sessions.
 **/
serv.use(function (req, res, next) {
  req.content = {
    title: 'A page title',
    brand: 'Your brand name'
  };

  next();
});

/**
 * Check routes before errors.
 **/
serv.use(serv.router);

/**
 * Error handler, runs when route returns a error.
 **/
serv.use(function (err, req, res, next) {
  console.error('Error: ' + err.message + ' - ' + req.url);
  console.error(err.stack);

  res.status(err.status || 500);
  if (req.accepts('html')) {
    req.content.error = err;
    res.set('Content-Type', 'text/html');
    res.render('page/error', req.content);
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.json({
      error: err.message
    });
  } else {
    res.set('Content-Type', 'text/plain');
    res.send('Error: ' + err.message);
  }
});

/**
 * Not found is the last module on the middleware stack, only 
 * gets called if other modules don't deal with the request.
 **/
serv.use(function (req, res, next) {
  res.status(404);
  req.content.error = {};
  req.content.error.status = 404;
  req.content.error.message = "Route not found."

  console.error('Error:' + req.content.error.message + ' - ' + req.url);

  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.render('page/error', req.content);
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.json({
      error: req.content.error.message
    });
  } else {
    res.set('Content-Type', 'text/plain');
    res.send('Error: ' + req.content.error.message);
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
