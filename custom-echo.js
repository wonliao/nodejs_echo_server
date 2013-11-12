
var sys = require("sys")
  , fs = require("fs")
  , path = require("path")
  , http = require("http")
  , ws = require(__dirname + '/remy-node-websocket-server-66ca366');


function serveFile(req, res){
  if( req.url.indexOf("favicon") > -1 ){

    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end("");
  } else {

    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream( path.normalize(path.join(__dirname, "client.html")), {
      'flags': 'r',
      'encoding': 'binary',
      'mode': 0666,
      'bufferSize': 4 * 1024
    }).addListener("data", function(chunk){
      res.write(chunk, 'binary');
    }).addListener("close",function() {
      res.end();
    });
  }
};

/*-----------------------------------------------
  Spin up our server:
-----------------------------------------------*/
var httpServer = http.createServer(serveFile);


var connected = 0;
var server = ws.createServer({
  debug: true
}, httpServer);

server.addListener("listening", function(){

});

// Handle WebSocket Requests
server.addListener("connection", function(conn){
 
  connected++;
  server.send(conn.id, connected+'');
  conn.broadcast(connected+'');
  
  conn.addListener("message", function(message){

  	conn.broadcast(message);
  });
});

server.addListener("close", function(conn){

  connected--;
  conn.broadcast(connected+'');
});



// 請修改成你的 port 及 ip
server.listen(8000, '192.168.1.143');

