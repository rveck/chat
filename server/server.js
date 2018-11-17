var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');
const admin = require('firebase-admin');

var serviceAccount = require('./poc-nodejs-222721-a9138594f67a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

db.collection('mensagens').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });


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

			var docRef = db.collection('mensagens').doc('teste');

			var setAda = docRef.set({
			  emissor: 'POC NODE JS',
			  mensagem: msg,
			  data_envio: new Date()
			});
		}

	});
  
});