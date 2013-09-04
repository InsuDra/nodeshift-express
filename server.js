
var http = require('http');

/**
 * Grab the openshift ip and port for our 
 * public http server or default to localhost.
 **/
var ip = process.env.OPENSHIFT_NODEJS_IP ||
         process.env.OPENSHIFT_INTERNAL_IP ||
         '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT ||
           process.env.OPENSHIFT_INTERNAL_PORT ||
           8080;

/**
 * Most basic server that will return a Hello world string,
 * with the custom nodejs version and our NODE_ENV setting
 * from the .openshift/action_hooks/pre_start_nodejs file.
 **/
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello OpenShift,\n' +
          'Node.js: ' + process.version + '\n' +
          'Running in ' + process.env.NODE_ENV + ' mode.');
}).listen(port, ip);
