const host = 'http://localhost:3000';

$(function () {
	var socket = io.connect(host);
	
	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		
		$('#m').val('');
		
		return false;
	});
	
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});

	socket.on('number users', function(msg){
		$('#numUsers').text(msg);
	});

	socket.on('add user', function(msg){
		$('#users').append($('<li id="user_' + msg + '">').text(msg));
	});

	socket.on('remove user', function(msg){
		$( '#user_' + msg ).remove();

	});
});