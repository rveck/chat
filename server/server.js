var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');

http.listen(config.port, function(){
  console.log('listening on *:' + config.port);
});

var sockets = [];

io.on('connection', function(socket){

	sockets.push(socket);
  
  	console.log('a user connected. Users connected is ' + sockets.length);

  	io.emit('number users', sockets.length);

	socket.on('disconnect', function(){
		console.log('user disconnected');

		sockets.splice(sockets.indexOf(socket),1);

		io.emit('number users', sockets.length);

		if (socket.name != null){
			io.emit('remove user', socket.name);
		}
	});

	socket.on('chat message', function(msg){

		if (msg.toString().indexOf('nickname') === 0){
			msg = msg.replace('nickname ','');
			socket.name = msg;

			io.emit('chat message', 'Novo usuario na sala ' + socket.name);

			io.emit('add user', msg);
		}else{
			io.emit('chat message', msg);
		}

	});
  
});