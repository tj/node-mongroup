
var http = require('http');
var port = process.argv[2];

var server = http.createServer(function(req, res){
  res.writeHead(200, {' Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(port, '127.0.0.1');

console.log('Server running at http://127.0.0.1:' + port);

process.on('SIGQUIT', function(){
  console.log('server: shutting down');
  server.close(function(){
    console.log('server: exiting');
    process.exit();
  });
});
