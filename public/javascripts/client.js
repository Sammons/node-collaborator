$(document).ready(function() {
		var socket;
		
		try {
			
			//same port the local webserver runs on
			//socket = io.connect('http://devshock.sammonsben.com:80');
			var nameSent = false;
			socket = io.connect('http://localhost:3000');
			var myID = null;
			var usersInit = true;
			socket.on('welcome',function (message){
				myID = message.user;
				console.log(message);
				for (var u in message.users) {
					if (u != myID && $('#'+u).length ==0) {
						$('#otherInputContainer').append($('<div id="d'+u+'"><label id="l'+u+'">'
							+message.userNames[u]+'</label><br id="b'+u+'"/>'
							+'<input type="text" id="'+u+'"></div>'));

						usersInit =true;
					}
				}
			});
			socket.on('newChatter',function (message) {
				if ($('#'+message.user).length > 0) return;
				console.log('new user!',message);
				$('#otherInputContainer').append($(
					'<div id="d'+message.user+'"><label id="l'+message.user+'">'+message.name+'</label><br/>'
					+'<input type="text" id="'+message.user+'"></div>'));
			});
			socket.on('lostAChatter',function (message) {
				console.log('lost a user!',message);
				$('#d'+message.user).remove();				
			});
			socket.on('keypress',function(message) {
				$('#'+message.user).val(message.text);
			});
			socket.on('chat',function (message) {
				var template = $('<div id="example" class="output"></div>');
				template.text(message.message);
				$('#outputs').append(template);
				setTimeout(function() {
					template.remove();
				},5000);
			});

		} catch (e) {
			console.log('hawt dog! the socket failed to instantiate');
		}
		$('#myInput').keyup(function(e) {
			if (e.which == 13) {
				try {
					if (nameSent) {
						socket.emit('update',{'message':$(this).val()});
					} else {
						nameSent = true;
						$('#myInput').attr('placeholder','Type to chat.');
						socket.emit('name',{'message':$(this).val()});
					}
					$(this).val('');
				} catch(e) {
					console.log('error sending message');
				}
			}
			socket.emit('keypress',{text: $('#myInput').val()})
		});
	});