var http = require('http');

var port = process.env.OPENSHIFT_NODEJS_PORT   ||
           process.env.OPENSHIFT_INTERNAL_PORT ||
           8080;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Version: ' + process.version);
}).listen(port);
