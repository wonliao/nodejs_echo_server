
var http = require("http");
var ws = require(__dirname + '/src');


/*-----------------------------------------------
  Spin up our server:
-----------------------------------------------*/
var httpServer = http.createServer();


var connected = 0;
var server = ws.createServer({
	debug: true
}, httpServer);

server.addListener("listening", function(){	
	/* do something */
});

// Handle WebSocket Requests
server.addListener("connection", function(conn){
	
	connected++;
	server.send(conn.id, connected+'');
	conn.broadcast(connected+'');
  
  	// 接收到訊息
  	conn.addListener("message", function(message){

		// 直接將訊息廣播出去
  		conn.broadcast(message);
  	});
});

server.addListener("close", function(conn){

	connected--;
	conn.broadcast(connected+'');
});


// 請修改成你的 port 及 ip
server.listen(8000, '192.168.1.143');

